import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import { useAI } from "@/hooks/useAI";
import { useImages } from "@/hooks/useImages";
import { usePosts } from "@/hooks/usePosts";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { useUserAuth } from "@/hooks/useUserAuth";
import { SocialPlatform } from "@/modules/types/SocialMediaTypes";
import { Theme } from "@/utils/theme";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@shopify/restyle";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { ArrowLeft, Magicpen } from "iconsax-react-nativejs";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

type ServerImage = {
  _id: string;
  name?: string;
  signedUrl?: string;
  url?: string;
};

type StepCardProps = {
  step: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const platformOptions = [
  {
    name: "Facebook",
    icon: "facebook",
    value: SocialPlatform.FACEBOOK,
    color: "#1877F2",
  },
  {
    name: "Instagram",
    icon: "instagram",
    value: SocialPlatform.INSTAGRAM,
    color: "#E4405F",
  },
  {
    name: "Twitter",
    icon: "twitter",
    value: SocialPlatform.TWITTER,
    color: "#1DA1F2",
  },
];

const ImagePost = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const { useUserDetails } = useUserAuth();
  const { data: userDetails } = useUserDetails();
  const userId = userDetails?.data?._id;
  const { useGetImages } = useImages();
  const { createPostMutation } = usePosts();
  const { generateImagePostMutation } = useAI();
  const { useGetConnectedAccounts, getConnectFacebookUrl } = useSocialMedia();

  const { data: imageResponse, isLoading: isImagesLoading } = useGetImages({
    page: 1,
    limit: 50,
  });
  const images: ServerImage[] = (imageResponse as any)?.data || [];
  const [selectedImage, setSelectedImage] = useState<ServerImage | null>(null);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [promptText, setPromptText] = useState("");
  const [isPromptSheetVisible, setIsPromptSheetVisible] = useState(false);
  const [approved, setApproved] = useState(true);
  const [generatedBody, setGeneratedBody] = useState("");
  const [overlayText, setOverlayText] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: connectedAccountsData, refetch: refetchConnectedAccounts } =
    useGetConnectedAccounts({
      userId: userId || "",
      page: 1,
      limit: 50,
    });

  const connectedAccounts = connectedAccountsData?.data || [];

  const previewImageUri = useMemo(
    () => selectedImage?.signedUrl || selectedImage?.url || "",
    [selectedImage],
  );

  const StepCard = ({ step, title, subtitle, children }: StepCardProps) => (
    <Box
      marginBottom="l"
      borderWidth={1}
      borderColor="borderColor"
      borderRadius={14}
      padding="m"
      backgroundColor="secondaryBackgroundColor"
    >
      <Box flexDirection="row" alignItems="center" marginBottom="s">
        <Box
          width={26}
          height={26}
          borderRadius={13}
          backgroundColor="primaryColor"
          justifyContent="center"
          alignItems="center"
        >
          <CustomText variant="body" color="white" style={{ fontWeight: "700" }}>
            {step}
          </CustomText>
        </Box>
        <CustomText variant="body" marginLeft="s" style={{ fontWeight: "700" }}>
          {title}
        </CustomText>
      </Box>
      <CustomText variant="body" color="bodyTextColor" marginBottom="m">
        {subtitle}
      </CustomText>
      {children}
    </Box>
  );

  const togglePlatform = (platform: SocialPlatform) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  const handleConnectPlatform = async (platform: SocialPlatform) => {
    if (!userId) {
      Toast.error("User not found");
      return;
    }

    if (platform !== SocialPlatform.FACEBOOK) {
      Toast.error(`${platform} connection is not available yet`);
      return;
    }

    try {
      const result = await getConnectFacebookUrl(userId);
      const url = (result as { url?: string })?.url;
      if (!url) {
        Toast.error("Failed to start connection");
        return;
      }
      await WebBrowser.openBrowserAsync(url);
      await refetchConnectedAccounts();
    } catch {
      Toast.error("Failed to connect account");
    }
  };

  const handleGenerateFromImage = () => {
    const prompt = promptText.trim();
    if (!prompt) {
      Toast.error("Please enter a prompt");
      return;
    }
    if (!selectedImage || !previewImageUri) {
      Toast.error("Please select an image first");
      return;
    }

    generateImagePostMutation.mutate(
      { prompt, imageUrl: previewImageUri },
      {
        onSuccess: (response) => {
          const data = response.data;
          if (!data?.body || !data?.overlayText || !data?.scheduledAt) {
            Toast.error("AI response is incomplete");
            return;
          }
          setGeneratedBody(data.body);
          setOverlayText(data.overlayText);
          setScheduledAt(data.scheduledAt);
          setApproved(true);
          setIsPromptSheetVisible(false);
          Toast.success("Image post generated");
        },
      },
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (!selectedDate || event?.type === "dismissed") return;
    setScheduledAt(selectedDate.toISOString());
  };

  const handleSchedulePost = async () => {
    if (!userId) {
      Toast.error("User not found");
      return;
    }
    if (!selectedImage?._id) {
      Toast.error("Select an image");
      return;
    }
    if (!generatedBody || !scheduledAt) {
      Toast.error("Generate the AI image post first");
      return;
    }
    if (!approved) {
      Toast.error("Approve the generated post first");
      return;
    }
    if (!platforms.length) {
      Toast.error("Select at least one platform");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        userId,
        body: generatedBody,
        platform: platforms,
        image: selectedImage._id,
        scheduledAt,
      });
      Toast.success("Image post scheduled");
      router.push("/dashboard/home/posts");
    } catch {
      Toast.error("Failed to schedule image post");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundColor }}
    >
      <Box flex={1} padding="m">
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.headerTextColor} />
          </TouchableOpacity>
          <CustomText variant="header" marginLeft="m">
            Image Post
          </CustomText>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Box
            marginBottom="l"
            flexDirection="row"
            style={{ flexWrap: "wrap", gap: 8 }}
          >
            <Box
              paddingHorizontal="m"
              paddingVertical="s"
              borderRadius={999}
              backgroundColor="secondaryBackgroundColor"
              borderWidth={1}
              borderColor="borderColor"
            >
              <CustomText variant="body" color="bodyTextColor">
                Image: {selectedImage ? "Selected" : "Not Selected"}
              </CustomText>
            </Box>
            <Box
              paddingHorizontal="m"
              paddingVertical="s"
              borderRadius={999}
              backgroundColor="secondaryBackgroundColor"
              borderWidth={1}
              borderColor="borderColor"
            >
              <CustomText variant="body" color="bodyTextColor">
                Platforms: {platforms.length}
              </CustomText>
            </Box>
          </Box>

          <StepCard
            step="1"
            title="Pick Image"
            subtitle="Choose the image asset to use for this scheduled post."
          >
            {isImagesLoading ? (
              <ActivityIndicator color={theme.colors.primaryColor} />
            ) : (
              <Box flexDirection="row" style={{ flexWrap: "wrap", gap: 12 }}>
                {images.map((img) => {
                  const uri = img.signedUrl || img.url || "";
                  const isSelected = selectedImage?._id === img._id;
                  return (
                    <Pressable
                      key={img._id}
                      onPress={() => setSelectedImage(img)}
                      style={{
                        width: "47%",
                        borderRadius: 12,
                        overflow: "hidden",
                        borderWidth: 2,
                        borderColor: isSelected
                          ? theme.colors.primaryColor
                          : "transparent",
                      }}
                    >
                      <Image
                        source={{ uri }}
                        style={{ width: "100%", height: 120 }}
                        resizeMode="cover"
                      />
                    </Pressable>
                  );
                })}
              </Box>
            )}
          </StepCard>

          <StepCard
            step="2"
            title="Generate Content"
            subtitle="Use AI to generate caption, overlay text, and a suggested schedule."
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: theme.colors.primaryColor,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 20,
                alignSelf: "flex-start",
                opacity:
                  generateImagePostMutation.isPending || !selectedImage
                    ? 0.7
                    : 1,
              }}
              onPress={() => setIsPromptSheetVisible(true)}
              disabled={generateImagePostMutation.isPending || !selectedImage}
            >
              <Magicpen size={16} color="white" variant="Bold" />
              <CustomText
                variant="body"
                color="white"
                fontSize={12}
                marginLeft="s"
              >
                Generate from Image
              </CustomText>
            </Pressable>
          </StepCard>

          {!!previewImageUri && !!overlayText && (
            <StepCard
              step="3"
              title="Preview & Approve"
              subtitle="Review generated result before scheduling."
            >
              <ImageBackground
                source={{ uri: previewImageUri }}
                resizeMode="cover"
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 14,
                  overflow: "hidden",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.55)",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <CustomText
                    variant="body"
                    color="white"
                    style={{ fontWeight: "700" }}
                  >
                    {overlayText}
                  </CustomText>
                </View>
              </ImageBackground>
              <Box marginTop="m">
                <CustomText variant="body" marginBottom="s">
                  Generated Caption
                </CustomText>
                <Box
                  borderWidth={1}
                  borderColor="borderColor"
                  borderRadius={12}
                  padding="m"
                  backgroundColor="secondaryBackgroundColor"
                >
                  <CustomText variant="body" color="headerTextColor">
                    {generatedBody}
                  </CustomText>
                </Box>
              </Box>
              <Box
                marginTop="m"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <CustomText variant="body" color="bodyTextColor">
                  {new Date(scheduledAt).toLocaleString()}
                </CustomText>
                <Pressable onPress={() => setShowDatePicker(true)}>
                  <CustomText
                    variant="body"
                    color="primaryColor"
                    style={{ fontWeight: "700" }}
                  >
                    Change date/time
                  </CustomText>
                </Pressable>
              </Box>
              <Box
                marginTop="m"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <CustomText variant="body">Approval</CustomText>
                <Pressable onPress={() => setApproved((v) => !v)}>
                  <CustomText
                    variant="body"
                    color={approved ? "primaryColor" : "bodyTextColor"}
                    style={{ fontWeight: "700" }}
                  >
                    {approved ? "Approved" : "Not Approved"}
                  </CustomText>
                </Pressable>
              </Box>
            </StepCard>
          )}

          <StepCard
            step="4"
            title="Platform & Schedule"
            subtitle="Select platforms, then schedule the approved post."
          >
            {connectedAccounts.length > 0 ? (
              <Box flexDirection="row" style={{ flexWrap: "wrap", gap: 12 }}>
                {connectedAccounts.map((acc) => {
                  const isSelected = platforms.includes(acc.platform);
                  return (
                    <Pressable
                      key={acc._id}
                      onPress={() => togglePlatform(acc.platform)}
                      style={{
                        padding: 12,
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? theme.colors.primaryColor
                          : theme.colors.borderColor,
                        backgroundColor: isSelected
                          ? theme.colors.secondaryBackgroundColor
                          : theme.colors.mainBackgroundColor,
                        minWidth: 120,
                      }}
                    >
                      <CustomText
                        variant="body"
                        fontSize={12}
                        fontWeight="bold"
                        color={isSelected ? "headerTextColor" : "bodyTextColor"}
                      >
                        {acc.accountHandle}
                      </CustomText>
                      <CustomText
                        variant="body"
                        fontSize={10}
                        marginTop="s"
                        color="bodyTextColor"
                      >
                        {acc.platform}
                      </CustomText>
                      <CustomText
                        variant="body"
                        fontSize={10}
                        marginTop="s"
                        color={isSelected ? "primaryColor" : "bodyTextColor"}
                        style={{ fontWeight: "700" }}
                      >
                        {isSelected ? "Selected" : "Tap to select"}
                      </CustomText>
                    </Pressable>
                  );
                })}
              </Box>
            ) : (
              <Box flexDirection="row" gap="m">
                {platformOptions.map((p) => (
                  <Pressable
                    key={p.name}
                    onPress={() => handleConnectPlatform(p.value)}
                    style={{
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: theme.colors.borderColor,
                      backgroundColor: theme.colors.mainBackgroundColor,
                      alignItems: "center",
                      minWidth: 80,
                    }}
                  >
                    <FontAwesome name={p.icon as any} size={24} color={p.color} />
                    <CustomText
                      variant="body"
                      fontSize={10}
                      marginTop="s"
                      color="bodyTextColor"
                    >
                      {p.name}
                    </CustomText>
                  </Pressable>
                ))}
              </Box>
            )}
          </StepCard>

          <Button
            title="Schedule Image Post"
            onPress={handleSchedulePost}
            isLoading={createPostMutation.isPending}
            disabled={
              createPostMutation.isPending ||
              !approved ||
              !generatedBody ||
              !scheduledAt ||
              !platforms.length
            }
          />
        </ScrollView>
      </Box>

      {showDatePicker && (
        <DateTimePicker
          value={scheduledAt ? new Date(scheduledAt) : new Date()}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      <Modal
        visible={isPromptSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPromptSheetVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <TouchableWithoutFeedback onPress={() => setIsPromptSheetVisible(false)}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.45)",
              }}
            />
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Box
              backgroundColor="mainBackgroundColor"
              padding="m"
              style={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderWidth: 1,
                borderColor: theme.colors.borderColor,
              }}
            >
              <Box alignItems="center" marginBottom="m">
                <View
                  style={{
                    width: 52,
                    height: 6,
                    borderRadius: 4,
                    backgroundColor: theme.colors.borderColor,
                  }}
                />
              </Box>
              <CustomText variant="regularHeader" marginBottom="s">
                Image Prompt
              </CustomText>
              <CustomText variant="body" color="bodyTextColor" marginBottom="m">
                Describe how the text on this image should be rewritten and when
                it should be scheduled.
              </CustomText>
              <Box
                borderWidth={1}
                borderColor="borderColor"
                borderRadius={14}
                padding="m"
                backgroundColor="secondaryBackgroundColor"
                marginBottom="m"
              >
                <TextInput
                  value={promptText}
                  onChangeText={setPromptText}
                  placeholder="Example: Rewrite this design text for a weekend promo and schedule next Wednesday 9am."
                  placeholderTextColor={theme.colors.bodyTextColor}
                  multiline
                  numberOfLines={4}
                  style={{
                    minHeight: 120,
                    color: theme.colors.headerTextColor,
                    textAlignVertical: "top",
                  }}
                />
              </Box>
              <Button
                title="Generate Image Post"
                onPress={handleGenerateFromImage}
                isLoading={generateImagePostMutation.isPending}
                disabled={generateImagePostMutation.isPending}
              />
              <Pressable
                onPress={() => setIsPromptSheetVisible(false)}
                style={{ alignItems: "center", paddingBottom: 8 }}
              >
                <CustomText
                  variant="body"
                  color="bodyTextColor"
                  style={{ fontWeight: "600" }}
                >
                  Cancel
                </CustomText>
              </Pressable>
            </Box>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ImagePost;
