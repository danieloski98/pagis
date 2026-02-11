import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import { Theme } from "@/utils/theme";
import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { ArrowLeft, DocumentText, Gallery } from "iconsax-react-nativejs";
import React from "react";
import { Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CreatePostSelection = () => {
  const router = useRouter();
  const theme = useTheme<Theme>();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundColor }}
    >
      <Box flex={1} padding="m">
        {/* Header */}
        <Box flexDirection="row" alignItems="center" marginBottom="l">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.headerTextColor} />
          </TouchableOpacity>
          <CustomText variant="header" marginLeft="m">
            Create New Post
          </CustomText>
        </Box>

        <Box alignItems="center" marginTop="l" marginBottom="xl">
          <CustomText
            variant="regularHeader"
            textAlign="center"
            marginBottom="s"
          >
            Choose Post Type
          </CustomText>
          <CustomText variant="body" textAlign="center" color="bodyTextColor">
            Select the type of content you want to create
          </CustomText>
        </Box>

        <Box gap="m">
          <Pressable onPress={() => router.push("/create-post/text" as any)}>
            <Box
              backgroundColor="mainBackgroundColor"
              padding="l"
              borderRadius={16}
              borderWidth={1}
              borderColor="borderColor"
              flexDirection="row"
              alignItems="center"
              style={{
                shadowColor: theme.colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Box
                width={50}
                height={50}
                backgroundColor="primaryColor"
                borderRadius={12}
                justifyContent="center"
                alignItems="center"
                opacity={0.1}
                position="absolute"
                left={16}
              />
              <Box
                width={50}
                height={50}
                justifyContent="center"
                alignItems="center"
                marginRight="m"
              >
                <DocumentText
                  size={24}
                  color={theme.colors.primaryColor}
                  variant="Bold"
                />
              </Box>
              <Box flex={1}>
                <CustomText variant="body" fontWeight="bold" marginBottom="s">
                  Text Post
                </CustomText>
                <CustomText variant="body" fontSize={12} color="bodyTextColor">
                  Create engaging text content with AI assistance
                </CustomText>
              </Box>
            </Box>
          </Pressable>

          <Pressable onPress={() => router.push("/create-post/image" as any)}>
            <Box
              backgroundColor="mainBackgroundColor"
              padding="l"
              borderRadius={16}
              borderWidth={1}
              borderColor="borderColor"
              flexDirection="row"
              alignItems="center"
              style={{
                shadowColor: theme.colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Box
                width={50}
                height={50}
                backgroundColor="error"
                borderRadius={12}
                justifyContent="center"
                alignItems="center"
                opacity={0.1}
                position="absolute"
                left={16}
              />
              <Box
                width={50}
                height={50}
                justifyContent="center"
                alignItems="center"
                marginRight="m"
              >
                <Gallery size={24} color={theme.colors.error} variant="Bold" />
              </Box>
              <Box flex={1}>
                <CustomText variant="body" fontWeight="bold" marginBottom="s">
                  Image Post
                </CustomText>
                <CustomText variant="body" fontSize={12} color="bodyTextColor">
                  Upload and edit images with AI-generated captions
                </CustomText>
              </Box>
            </Box>
          </Pressable>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default CreatePostSelection;
