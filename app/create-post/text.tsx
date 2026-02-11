import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import { useAI } from "@/hooks/useAI";
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

type PlannedPost = {
  id: string;
  body: string;
  scheduledAt: string;
  approved: boolean;
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

const TextPost = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const { createPostMutation } = usePosts();
  const { generateContentPlanMutation } = useAI();
  const { useGetConnectedAccounts, getConnectFacebookUrl } = useSocialMedia();
  const { useUserDetails } = useUserAuth();

  const { data: userDetails } = useUserDetails();
  const userId = userDetails?.data?._id;

  const { data: connectedAccountsData, refetch: refetchConnectedAccounts } =
    useGetConnectedAccounts({
      userId: userId || "",
      page: 1,
      limit: 50,
    });

  const connectedAccounts = connectedAccountsData?.data || [];
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const [isPromptSheetVisible, setIsPromptSheetVisible] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [plannedPosts, setPlannedPosts] = useState<PlannedPost[]>([]);
  const [activeDatePickerPostId, setActiveDatePickerPostId] = useState<
    string | null
  >(null);
  const [isScheduling, setIsScheduling] = useState(false);

  const approvedPosts = useMemo(
    () => plannedPosts.filter((post) => post.approved),
    [plannedPosts],
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

  const togglePostApproval = (postId: string) => {
    setPlannedPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, approved: !post.approved } : post,
      ),
    );
  };

  const handleGeneratePlan = () => {
    const prompt = promptText.trim();
    if (!prompt) {
      Toast.error("Please enter a prompt");
      return;
    }

    generateContentPlanMutation.mutate(prompt, {
      onSuccess: (response) => {
        const posts = response.data?.posts ?? [];
        if (!posts.length) {
          Toast.error("No post plan returned from AI");
          return;
        }

        const mappedPosts: PlannedPost[] = posts.map((post, index) => ({
          id: `${Date.now()}-${index}`,
          body: post.body,
          scheduledAt: post.scheduledAt,
          approved: true,
        }));

        setPlannedPosts(mappedPosts);
        setIsPromptSheetVisible(false);
        Toast.success("Post plan generated");
      },
    });
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const selectedPostId = activeDatePickerPostId;
    setActiveDatePickerPostId(null);

    if (!selectedDate || !selectedPostId || event?.type === "dismissed") return;

    setPlannedPosts((prev) =>
      prev.map((post) =>
        post.id === selectedPostId
          ? { ...post, scheduledAt: selectedDate.toISOString() }
          : post,
      ),
    );
  };

  const handleScheduleApprovedPosts = async () => {
    if (!userId) {
      Toast.error("User not found");
      return;
    }

    if (platforms.length === 0) {
      Toast.error("Select at least one platform");
      return;
    }

    if (!approvedPosts.length) {
      Toast.error("Approve at least one generated post");
      return;
    }

    setIsScheduling(true);
    try {
      for (const post of approvedPosts) {
        await createPostMutation.mutateAsync({
          userId,
          body: post.body,
          platform: platforms,
          scheduledAt: post.scheduledAt,
        });
      }
      Toast.success("Approved posts scheduled");
      router.push("/dashboard/home/posts");
    } catch {
      Toast.error("Failed to schedule one or more posts");
    } finally {
      setIsScheduling(false);
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
            Text Post Plan
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
                Planned: {plannedPosts.length}
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
                Approved: {approvedPosts.length}
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
            title="Generate Plan"
            subtitle="Describe volume and timeframe. AI will propose post text and schedule times."
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
                opacity: generateContentPlanMutation.isPending ? 0.7 : 1,
              }}
              onPress={() => setIsPromptSheetVisible(true)}
              disabled={generateContentPlanMutation.isPending}
            >
              <Magicpen size={16} color="white" variant="Bold" />
              <CustomText
                variant="body"
                color="white"
                fontSize={12}
                marginLeft="s"
              >
                Generate with AI
              </CustomText>
            </Pressable>
          </StepCard>

          <StepCard
            step="2"
            title="Select Platforms"
            subtitle="Pick where approved posts should be scheduled."
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
              <Box gap="m">
                <CustomText variant="body" color="bodyTextColor">
                  Connect a platform first. After successful connection, return and
                  select it for scheduling.
                </CustomText>
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
                      <FontAwesome
                        name={p.icon as any}
                        size={24}
                        color={p.color}
                      />
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
              </Box>
            )}
          </StepCard>

          <StepCard
            step="3"
            title="Approve Posts"
            subtitle="Review generated posts, adjust date/time, and approve what should be scheduled."
          >
            {!plannedPosts.length ? (
              <Box
                borderWidth={1}
                borderColor="borderColor"
                borderRadius={12}
                padding="m"
                backgroundColor="mainBackgroundColor"
              >
                <CustomText variant="body" color="bodyTextColor">
                  No generated posts yet. Start by generating a plan.
                </CustomText>
              </Box>
            ) : (
              <Box gap="m">
                {plannedPosts.map((post, index) => (
                  <Box
                    key={post.id}
                    borderWidth={1}
                    borderColor={post.approved ? "primaryColor" : "borderColor"}
                    borderRadius={12}
                    padding="m"
                    backgroundColor={
                      post.approved
                        ? "secondaryBackgroundColor"
                        : "mainBackgroundColor"
                    }
                  >
                    <Box
                      flexDirection="row"
                      justifyContent="space-between"
                      alignItems="center"
                      marginBottom="s"
                    >
                      <CustomText variant="body" fontWeight="bold">
                        Post {index + 1}
                      </CustomText>
                      <Pressable onPress={() => togglePostApproval(post.id)}>
                        <CustomText
                          variant="body"
                          color={post.approved ? "primaryColor" : "bodyTextColor"}
                          fontWeight="bold"
                        >
                          {post.approved ? "Approved" : "Not Approved"}
                        </CustomText>
                      </Pressable>
                    </Box>
                    <CustomText variant="body" color="headerTextColor">
                      {post.body}
                    </CustomText>
                    <Box marginTop="m">
                      <CustomText variant="body" color="bodyTextColor">
                          {new Date(post.scheduledAt).toLocaleString()}
                        </CustomText>
                        <Pressable
                          onPress={() => setActiveDatePickerPostId(post.id)}
                          style={{ marginTop: 8 }}
                      >
                        <CustomText
                          variant="body"
                          color="primaryColor"
                          fontWeight="bold"
                        >
                          Change date/time
                        </CustomText>
                      </Pressable>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </StepCard>

          <Button
            title={`Schedule Approved (${approvedPosts.length})`}
            onPress={handleScheduleApprovedPosts}
            isLoading={isScheduling || createPostMutation.isPending}
            disabled={!approvedPosts.length || !platforms.length}
          />
        </ScrollView>
      </Box>

      {activeDatePickerPostId && (
        <DateTimePicker
          value={
            new Date(
              plannedPosts.find((post) => post.id === activeDatePickerPostId)
                ?.scheduledAt || new Date().toISOString(),
            )
          }
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
                AI Prompt
              </CustomText>
              <CustomText variant="body" color="bodyTextColor" marginBottom="m">
                Ask for monthly/weekly quantity, audience, and tone.
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
                  placeholder="Describe how many posts and timeframe..."
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
                title="Generate Plan"
                onPress={handleGeneratePlan}
                isLoading={generateContentPlanMutation.isPending}
                disabled={generateContentPlanMutation.isPending}
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

export default TextPost;
