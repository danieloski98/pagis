import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import CustomText from "@/components/ui/CustomText";
import { usePosts } from "@/hooks/usePosts";
import { useUserAuth } from "@/hooks/useUserAuth";
import { IPost, SocialPlatform } from "@/modules/types/SocialMediaTypes";
import { Theme } from "@/utils/theme";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { useRouter } from "expo-router";
import { Add, Edit2, Timer } from "iconsax-react-nativejs";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Posts = () => {
  const theme = useTheme<Theme>();
  const router = useRouter();
  const { useUserDetails } = useUserAuth();
  const { data: userDetails } = useUserDetails();
  const userId = userDetails?.data?._id;

  const { useGetUserPosts } = usePosts();
  const {
    data: postsData,
    isLoading,
    refetch,
  } = useGetUserPosts({ userId: userId || "" });
  const posts = postsData?.data || [];

  const renderItem = ({ item }: { item: IPost }) => (
    <Box
      backgroundColor="mainBackgroundColor"
      padding="m"
      marginBottom="m"
      borderRadius={16}
      borderWidth={1}
      borderColor="borderColor"
      style={{
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="s"
      >
        <Box flexDirection="row" gap="s">
          {item.platform.map((p) => {
            let iconName = "facebook";
            let color = "#1877F2";
            if (p === SocialPlatform.INSTAGRAM) {
              iconName = "instagram";
              color = "#E4405F";
            }
            if (p === SocialPlatform.TWITTER) {
              iconName = "twitter";
              color = "#1DA1F2";
            }

            return (
              <FontAwesome
                key={p}
                name={iconName as any}
                size={16}
                color={color}
              />
            );
          })}
        </Box>
        {item.scheduledAt && (
          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="secondaryBackgroundColor"
            paddingHorizontal="s"
            paddingVertical="s"
            borderRadius={8}
          >
            <Timer size={14} color={theme.colors.bodyTextColor} />
            <CustomText
              variant="body"
              fontSize={10}
              marginLeft="s"
              color="bodyTextColor"
            >
              {new Date(item.scheduledAt).toLocaleDateString()}
            </CustomText>
          </Box>
        )}
      </Box>

      <CustomText variant="body" numberOfLines={3} marginBottom="s">
        {item.body}
      </CustomText>

      <Box flexDirection="row" justifyContent="flex-end">
        <CustomText variant="body" fontSize={12} color="bodyTextColor">
          {item.status}
        </CustomText>
      </Box>
    </Box>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundColor }}
    >
      <Box flex={1} padding="m">
        <Box marginBottom="l">
          <CustomText variant="header">Posts</CustomText>
        </Box>

        {isLoading ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <ActivityIndicator size="large" color={theme.colors.primaryColor} />
          </Box>
        ) : posts.length === 0 ? (
          <Box flex={1} justifyContent="center" alignItems="center">
            <Box
              width={80}
              height={80}
              backgroundColor="secondaryBackgroundColor"
              borderRadius={40}
              justifyContent="center"
              alignItems="center"
              marginBottom="l"
            >
              <Edit2
                size={32}
                color={theme.colors.primaryColor}
                variant="Bold"
              />
            </Box>
            <CustomText
              variant="header"
              fontSize={20}
              textAlign="center"
              marginBottom="s"
            >
              No Posts Yet
            </CustomText>
            <CustomText
              variant="body"
              textAlign="center"
              color="bodyTextColor"
              marginBottom="l"
            >
              Create your first post to get started with engaging your audience.
            </CustomText>
            <Button
              title="Create Post"
              width="60%"
              onPress={() => router.push("/create-post")}
            />
          </Box>
        ) : (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
          />
        )}

        {posts.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push("/create-post")}
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: theme.colors.primaryColor,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: theme.colors.primaryColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Add size={32} color="white" />
          </TouchableOpacity>
        )}
      </Box>
    </SafeAreaView>
  );
};

export default Posts;
