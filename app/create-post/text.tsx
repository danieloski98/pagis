import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import CustomTextInput from "@/components/ui/TextInput";
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
import { Formik } from "formik";
import { ArrowLeft, Magicpen } from "iconsax-react-nativejs";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";
import * as Yup from "yup";

const TextPost = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();
  const [platforms, setPlatforms] = useState<SocialPlatform[]>([]);
  const { useUserDetails } = useUserAuth();
  const { data: userDetails } = useUserDetails();
  const userId = userDetails?.data?._id;
  const { createPostMutation } = usePosts();
  const { generateContentMutation } = useAI();
  const { useGetConnectedAccounts, getConnectFacebookUrl } = useSocialMedia();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPromptSheetVisible, setIsPromptSheetVisible] = useState(false);
  const [promptText, setPromptText] = useState("");
  const setFieldValueRef = useRef<
    ((field: string, value: any, shouldValidate?: boolean) => void) | null
  >(null);

  const {
    data: connectedAccountsData,
    refetch: refetchConnectedAccounts,
  } = useGetConnectedAccounts({
    userId: userId || "",
    page: 1,
    limit: 50,
  });
  const connectedAccounts = connectedAccountsData?.data || [];

  const togglePlatform = (platform: SocialPlatform) => {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  };

  const openPromptSheet = () => {
    setPromptText("");
    setIsPromptSheetVisible(true);
  };

  const handleGenerateContent = () => {
    const prompt = promptText.trim();
    if (!prompt) {
      Toast.error("Please enter a prompt");
      return;
    }

    generateContentMutation.mutate(prompt, {
      onSuccess: (data) => {
        setFieldValueRef.current?.("body", data.data?.content ?? "");
        Toast.success("Content generated successfully!");
        setIsPromptSheetVisible(false);
      },
      onError: () => {
        // Error toast handled in hook
      },
    });
  };

  const handleDateChange = (
    event: any,
    selectedDate?: Date,
    setFieldValue?: (field: string, value: any) => void,
  ) => {
    setShowDatePicker(false);
    if (selectedDate && setFieldValue) {
      const formattedDate = selectedDate
        .toISOString()
        .slice(0, 16)
        .replace("T", " ");
      setFieldValue("scheduledAt", formattedDate);
    }
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
      const url = (result as any)?.url;
      if (!url) {
        Toast.error("Failed to start connection");
        return;
      }
      await WebBrowser.openBrowserAsync(url);
      await refetchConnectedAccounts();
    } catch (error) {
      Toast.error("Failed to connect account");
    }
  };

  const validationSchema = Yup.object().shape({
    body: Yup.string().required("Content is required"),
    scheduledAt: Yup.string().when("isScheduled", {
      is: true,
      then: (schema) => schema.required("Date is required (YYYY-MM-DD HH:mm)"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handlePublish = (values: any) => {
    if (!userId) {
      Toast.error("User not found");
      return;
    }
    if (platforms.length === 0) {
      Toast.error("Please select at least one platform");
      return;
    }

    const payload = {
      userId,
      body: values.body,
      platform: platforms,
      scheduledAt: values.isScheduled
        ? new Date(values.scheduledAt).toISOString()
        : undefined, // Don't include scheduledAt for drafts
    };

    createPostMutation.mutate(payload, {
      onSuccess: () => {
        router.push("/dashboard/home/posts");
      },
    });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundColor }}
    >
      <Formik
        initialValues={{ body: "", isScheduled: false, scheduledAt: "" }}
        validationSchema={validationSchema}
        onSubmit={handlePublish}
      >
        {({ handleSubmit, values, setFieldValue, isSubmitting }) => {
          setFieldValueRef.current = setFieldValue;
          return (
            <Box flex={1} padding="m">
            {/* Header */}
            <Box flexDirection="row" alignItems="center" marginBottom="l">
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={theme.colors.headerTextColor} />
              </TouchableOpacity>
              <CustomText variant="header" marginLeft="m">
                Text Post
              </CustomText>
              <Box flex={1} />
              {/* Optional: Add save draft button in header or below */}
            </Box>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Post Content */}
              <Box marginBottom="l">
                <CustomText variant="body" marginBottom="s">
                  Post Content
                </CustomText>
                <CustomTextInput
                  name="body"
                  placeholder="What's on your mind?"
                  multiline
                  numberOfLines={6}
                  height={150}
                  textAlignVertical="top"
                  style={{ paddingTop: 10 }}
                />
                <Box
                  flexDirection="row"
                  justifyContent="flex-end"
                  marginTop="s"
                >
                  <Pressable
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: theme.colors.primaryColor,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 20,
                      opacity: generateContentMutation.isPending ? 0.7 : 1,
                    }}
                    onPress={openPromptSheet}
                    disabled={generateContentMutation.isPending}
                  >
                    {generateContentMutation.isPending ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <>
                        <Magicpen size={16} color="white" variant="Bold" />
                        <CustomText
                          variant="body"
                          color="white"
                          fontSize={12}
                          marginLeft="s"
                        >
                          Generate with AI
                        </CustomText>
                      </>
                    )}
                  </Pressable>
                </Box>
              </Box>

              {/* Select Platform */}
              <Box marginBottom="l">
                <CustomText variant="body" marginBottom="s">
                  Select Platform
                </CustomText>
                {connectedAccounts.length > 0 ? (
                  <Box
                    flexDirection="row"
                    style={{ flexWrap: "wrap", gap: 12 }}
                  >
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
                            color={
                              isSelected ? "headerTextColor" : "bodyTextColor"
                            }
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
                        </Pressable>
                      );
                    })}
                  </Box>
                ) : (
                  <Box gap="m">
                    <CustomText variant="body" color="bodyTextColor">
                      Connect a platform to enable posting.
                    </CustomText>
                    <Box flexDirection="row" gap="m">
                      {[
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
                      ].map((p) => (
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
              </Box>

              {/* Schedule Post */}
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                marginBottom="l"
                padding="m"
                backgroundColor="secondaryBackgroundColor"
                borderRadius={12}
              >
                <Box flexDirection="row" alignItems="center" gap="s">
                  <CustomText variant="body" fontWeight="bold">
                    Schedule Post
                  </CustomText>
                </Box>
                <Switch
                  value={values.isScheduled}
                  onValueChange={(val) => {
                    setFieldValue("isScheduled", val);
                  }}
                  trackColor={{
                    false: theme.colors.borderColor,
                    true: theme.colors.primaryColor,
                  }}
                />
              </Box>

              {/* Date Picker */}
              {values.isScheduled && (
                <Box marginBottom="l">
                  <CustomText variant="body" marginBottom="s">
                    Date & Time
                  </CustomText>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    style={{
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: theme.colors.borderColor,
                      backgroundColor: theme.colors.mainBackgroundColor,
                    }}
                  >
                    <CustomText variant="body" color="bodyTextColor">
                      {values.scheduledAt || "Select date and time"}
                    </CustomText>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={
                        values.scheduledAt
                          ? new Date(values.scheduledAt)
                          : new Date()
                      }
                      mode="datetime"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) =>
                        handleDateChange(event, selectedDate, setFieldValue)
                      }
                      minimumDate={new Date()}
                    />
                  )}
                </Box>
              )}

              {/* Actions */}
              <Box flexDirection="row" gap="m" marginTop="l" marginBottom="xl">
                <Pressable
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.colors.borderColor,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    // Set isScheduled to false to save as draft
                    setFieldValue("isScheduled", false);
                    setFieldValue("scheduledAt", "");
                    setTimeout(() => handleSubmit(), 100);
                  }}
                >
                  <CustomText variant="body" fontWeight="bold">
                    Save as Draft
                  </CustomText>
                </Pressable>
                <Pressable
                  style={{
                    flex: 1,
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: theme.colors.buttonBgColor,
                    alignItems: "center",
                    opacity: createPostMutation.isPending ? 0.7 : 1,
                  }}
                  onPress={() => handleSubmit()}
                  disabled={createPostMutation.isPending}
                >
                  {createPostMutation.isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <CustomText variant="body" fontWeight="bold" color="white">
                      {values.isScheduled ? "Schedule" : "Publish Now"}
                    </CustomText>
                  )}
                </Pressable>
              </Box>
            </ScrollView>
            <Modal
              visible={isPromptSheetVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setIsPromptSheetVisible(false)}
            >
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <TouchableWithoutFeedback
                  onPress={() => setIsPromptSheetVisible(false)}
                >
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
                      shadowColor: theme.colors.black,
                      shadowOffset: { width: 0, height: -2 },
                      shadowOpacity: 0.08,
                      shadowRadius: 12,
                      elevation: 10,
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
                    <CustomText
                      variant="body"
                      color="bodyTextColor"
                      marginBottom="m"
                    >
                      Tell the AI what to write, include tone and audience if
                      helpful.
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
                        placeholder="Example: Write a friendly launch post for our new app update."
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
                      title="Generate"
                      onPress={handleGenerateContent}
                      isLoading={generateContentMutation.isPending}
                      disabled={generateContentMutation.isPending}
                    />
                    <Pressable
                      onPress={() => setIsPromptSheetVisible(false)}
                      style={{
                        alignItems: "center",
                        paddingBottom: 8,
                      }}
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
          </Box>
          );
        }}
      </Formik>
    </SafeAreaView>
  );
};

export default TextPost;
