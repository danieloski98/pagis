import CustomText from "@/components/ui/CustomText";
import { Theme } from "@/utils/theme";
import { createBox, useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import { Like1, Message, SearchNormal1, TrendUp } from "iconsax-react-nativejs";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Box = createBox<Theme>();
const { width } = Dimensions.get("window");

interface Topic {
  id: string;
  rank: number;
  title: string;
  likes: string;
  comments: string;
  isTrending: boolean;
}

const TOPICS: Topic[] = [
  {
    id: "1",
    rank: 1,
    title: "AI Revolution in Content Creation",
    likes: "124K",
    comments: "3.2K",
    isTrending: true,
  },
  {
    id: "2",
    rank: 2,
    title: "Small Business Marketing Tips 2025",
    likes: "98K",
    comments: "2.8K",
    isTrending: true,
  },
  {
    id: "3",
    rank: 3,
    title: "Social Media Growth Strategies",
    likes: "87K",
    comments: "2.1K",
    isTrending: true,
  },
  {
    id: "4",
    rank: 4,
    title: "Influencer Marketing Trends",
    likes: "76K",
    comments: "1.9K",
    isTrending: true,
  },
  {
    id: "5",
    rank: 5,
    title: "Content Calendar Best Practices",
    likes: "65K",
    comments: "1.5K",
    isTrending: true,
  },
  {
    id: "6",
    rank: 6,
    title: "Video Content Tips for Engagement",
    likes: "54K",
    comments: "1.3K",
    isTrending: true,
  },
];

const Home = () => {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState<"Facebook" | "Twitter">(
    "Facebook"
  );
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundColor }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Box padding="m">
          {/* Header */}
          <Box marginBottom="l">
            <CustomText variant="header" fontWeight="bold" marginBottom="s">
              Trending Topics
            </CustomText>
            <CustomText variant="body" color="bodyTextColor" opacity={0.7}>
              Discover what&apos;s trending and create engaging content
            </CustomText>
          </Box>

          {/* Search Bar */}
          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="mainBackgroundColor"
            borderRadius={12}
            borderWidth={1}
            borderColor="borderColor"
            paddingHorizontal="m"
            height={52}
            marginBottom="l"
          >
            <SearchNormal1
              size={20}
              color={theme.colors.bodyTextColor}
              opacity={0.5}
            />
            <TextInput
              style={{
                flex: 1,
                marginLeft: theme.spacing.s,
                fontFamily: "Inter-Regular",
                fontSize: 14,
                color: theme.colors.headerTextColor,
              }}
              placeholder="Search trending topics..."
              placeholderTextColor={theme.colors.bodyTextColor}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Box>

          {/* Tabs */}
          <Box
            flexDirection="row"
            backgroundColor="mainBackgroundColor"
            borderRadius={12}
            padding="s"
            marginBottom="l"
            // borderWidth={1}
            // borderColor="borderColor"
          >
            <TouchableOpacity
              onPress={() => setActiveTab("Facebook")}
              style={{ flex: 1 }}
              activeOpacity={0.8}
            >
              {activeTab === "Facebook" ? (
                <LinearGradient
                  colors={["#C27AFF", "#51A2FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#51A2FF",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <CustomText variant="body" fontWeight="600" color="white">
                    Facebook
                  </CustomText>
                </LinearGradient>
              ) : (
                <Box
                  paddingVertical="s"
                  alignItems="center"
                  justifyContent="center"
                  height={44}
                >
                  <CustomText variant="body" color="bodyTextColor">
                    Facebook
                  </CustomText>
                </Box>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("Twitter")}
              style={{ flex: 1 }}
              activeOpacity={0.8}
            >
              {activeTab === "Twitter" ? (
                <LinearGradient
                  colors={["#C27AFF", "#51A2FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#51A2FF",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <CustomText variant="body" fontWeight="600" color="white">
                    Twitter
                  </CustomText>
                </LinearGradient>
              ) : (
                <Box
                  paddingVertical="s"
                  alignItems="center"
                  justifyContent="center"
                  height={44}
                >
                  <CustomText variant="body" color="bodyTextColor">
                    Twitter
                  </CustomText>
                </Box>
              )}
            </TouchableOpacity>
          </Box>

          {/* Topics List */}
          <Box gap="m">
            {TOPICS.map((topic) => (
              <Box
                key={topic.id}
                backgroundColor="mainBackgroundColor"
                borderRadius={16}
                borderWidth={1}
                borderColor="borderColor"
                padding="m"
                style={{
                  shadowColor: theme.colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 2,
                }}
              >
                {/* Trending Label */}
                <Box flexDirection="row" alignItems="center" marginBottom="s">
                  <TrendUp
                    size={16}
                    color={theme.colors.primaryColor}
                    variant="Bold"
                  />
                  <CustomText
                    variant="body"
                    fontSize={12}
                    color="bodyTextColor"
                    marginLeft="s"
                    opacity={0.7}
                  >
                    #{topic.rank} Trending
                  </CustomText>
                </Box>

                {/* Title */}
                <CustomText
                  variant="medium"
                  fontWeight="bold"
                  marginBottom="m"
                  color="headerTextColor"
                >
                  {topic.title}
                </CustomText>

                {/* Stats */}
                <Box
                  flexDirection="row"
                  alignItems="center"
                  gap="l"
                  marginBottom="l"
                >
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <Like1
                      size={18}
                      color={theme.colors.bodyTextColor}
                      opacity={0.6}
                    />
                    <CustomText
                      variant="body"
                      fontSize={13}
                      color="bodyTextColor"
                      opacity={0.8}
                    >
                      {topic.likes}
                    </CustomText>
                  </Box>
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <Message
                      size={18}
                      color={theme.colors.bodyTextColor}
                      opacity={0.6}
                    />
                    <CustomText
                      variant="body"
                      fontSize={13}
                      color="bodyTextColor"
                      opacity={0.8}
                    >
                      {topic.comments}
                    </CustomText>
                  </Box>
                </Box>

                {/* Use Topic Button */}
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    colors={["#C27AFF", "#51A2FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <CustomText variant="body" fontWeight="600" color="white">
                      Use Topic
                    </CustomText>
                  </LinearGradient>
                </TouchableOpacity>
              </Box>
            ))}
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
