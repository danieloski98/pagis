import CustomText from "@/components/ui/CustomText";
import { useSocialMedia } from "@/hooks/useSocialMedia";
import { useUserAuth } from "@/hooks/useUserAuth";
import { TOKEN_KEY } from "@/modules/repositories/api-client";
import { SocialPlatform } from "@/modules/types/SocialMediaTypes";
import { darkModeAtom } from "@/states/atoms/dark-mode-state";
import { reset } from "@/states/slices/token.reducer";
import { Theme } from "@/utils/theme";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBox, useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  ArrowRight2,
  Card,
  LogoutCurve,
  Moon,
  Notification,
} from "iconsax-react-nativejs";
import { useAtom } from "jotai";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { useDispatch } from "react-redux";
import { Toast } from "toastify-react-native";

const Box = createBox<Theme>();

const Settings = () => {
  const theme = useTheme<Theme>();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const dispatch = useDispatch();

  const { useUserDetails } = useUserAuth();
  const { data: userDetails } = useUserDetails();
  const userId = userDetails?.data?._id;

  const {
    useGetConnectedAccounts,
    getConnectFacebookUrl,
    disconnectAccountMutation,
  } = useSocialMedia();
  const {
    data: accountsData,
    isLoading: isLoadingAccounts,
    refetch: refetchAccounts,
  } = useGetConnectedAccounts({
    userId: userId || "",
  });

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      dispatch(reset());
      // dispatch(resetUser());
      router.replace("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      Toast.error("Failed to logout");
    }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleConnect = async (platform: string) => {
    console.log("Handle Connect:", platform, userId);
    if (!userId) {
      Toast.error("User ID not found. Please try logging in again.");
      return;
    }

    if (platform === "Facebook") {
      try {
        // const redirectUrl =
        //   "https://pagixservernew-production.up.railway.app/social-account/facebook/callback";
        const url = await getConnectFacebookUrl(userId);
        console.log(`RETURNED URL`, url);
        const result = await WebBrowser.openAuthSessionAsync(url?.url);
        if (result.type === "success") {
          refetchAccounts();
        }
      } catch (error) {
        console.error("Error connecting Facebook:", error);
      }
    } else {
      Toast.warn("Only Facebook connection is currently supported.");
    }
  };

  const handleDisconnect = (account: any) => {
    disconnectAccountMutation.mutate(
      { id: account._id },
      {
        onSuccess: () => {
          Toast.success("Account disconnected");
          refetchAccounts();
        },
        onError: () => {
          Toast.error("Failed to disconnect account");
        },
      },
    );
  };

  const avatar = useMemo(() => {
    return createAvatar(initials, {
      seed: userDetails?.data?.firstName || "User",
      fontFamily: ["Arial", "Verdana"],
    }).toString();
  }, [userDetails]);

  const platformDefinitions = [
    {
      name: "Facebook",
      icon: <FontAwesome name="facebook" size={20} color="#1877F2" />,
      platformEnum: SocialPlatform.FACEBOOK,
    },
    {
      name: "Instagram",
      icon: <FontAwesome name="instagram" size={20} color="#E4405F" />,
      platformEnum: SocialPlatform.INSTAGRAM,
    },
    {
      name: "Twitter",
      icon: <FontAwesome name="twitter" size={20} color="#1DA1F2" />,
      platformEnum: SocialPlatform.TWITTER,
    },
  ];

  const connectedAccounts = useMemo(() => {
    const connected = accountsData?.data || [];
    return platformDefinitions.map((def) => {
      const found = connected.find(
        (acc) => acc.platform === def.platformEnum && !acc.isRevoked,
      );
      return {
        ...def,
        connected: !!found,
        accountData: found,
      };
    });
  }, [accountsData, platformDefinitions]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundColor }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Box padding="m" flex={1}>
          {/* Header */}
          <Box marginBottom="l">
            <CustomText variant="header" fontWeight="bold">
              Settings
            </CustomText>
            <CustomText
              variant="body"
              color="bodyTextColor"
              opacity={0.7}
              marginTop="s"
            >
              Manage your account and preferences
            </CustomText>
          </Box>

          {/* Profile Card */}
          <Box
            backgroundColor="mainBackgroundColor"
            padding="m"
            borderRadius={16}
            borderWidth={1}
            borderColor="borderColor"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            marginBottom="l"
            style={{
              shadowColor: theme.colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <Box flexDirection="row" alignItems="center" gap="m">
              <Box
                width={50}
                height={50}
                borderRadius={25}
                overflow="hidden"
                backgroundColor="primaryColor"
                alignItems="center"
                justifyContent="center"
              >
                <SvgXml xml={avatar} width={50} height={50} />
              </Box>
              <Box>
                <CustomText variant="medium" fontWeight="bold">
                  {userDetails?.data?.firstName} {userDetails?.data?.lastName}
                </CustomText>
                <CustomText variant="body" color="bodyTextColor" opacity={0.6}>
                  {userDetails?.data?.email}
                </CustomText>
              </Box>
            </Box>
            <Pressable>
              <ArrowRight2 size={20} color={theme.colors.bodyTextColor} />
            </Pressable>
          </Box>

          {/* Connected Accounts */}
          <Box marginBottom="l">
            <CustomText
              variant="body"
              fontWeight="bold"
              marginBottom="m"
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
              color="bodyTextColor"
              opacity={0.6}
            >
              Connected Accounts
            </CustomText>
            <Box
              backgroundColor="mainBackgroundColor"
              borderRadius={16}
              borderWidth={1}
              borderColor="borderColor"
              overflow="hidden"
            >
              {isLoadingAccounts ? (
                <Box padding="m" alignItems="center">
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primaryColor}
                  />
                </Box>
              ) : (
                connectedAccounts.map((account, index) => (
                  <Box
                    key={account.name}
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    padding="m"
                    borderBottomWidth={
                      index !== connectedAccounts.length - 1 ? 1 : 0
                    }
                    borderBottomColor="borderColor"
                  >
                    <Box flexDirection="row" alignItems="center" gap="m">
                      <Box width={24} alignItems="center">
                        {account.icon}
                      </Box>
                      <CustomText variant="body" fontWeight="500">
                        {account.name}
                      </CustomText>
                    </Box>
                    <Pressable
                      onPress={() =>
                        account.connected
                          ? handleDisconnect(account.accountData)
                          : handleConnect(account.name)
                      }
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                      })}
                    >
                      <Box
                        paddingHorizontal="s"
                        paddingVertical="s"
                        borderRadius={12}
                        style={{
                          backgroundColor: account.connected
                            ? "#E8F5E9"
                            : "#E3F2FD",
                        }}
                      >
                        <CustomText
                          variant="body"
                          fontWeight="bold"
                          style={{
                            color: account.connected ? "#2E7D32" : "#1976D2",
                            fontSize: 12,
                          }}
                        >
                          {account.connected ? "Connected" : "Connect"}
                        </CustomText>
                      </Box>
                    </Pressable>
                  </Box>
                ))
              )}
            </Box>
          </Box>

          {/* General Section */}
          <Box marginBottom="l">
            <CustomText
              variant="body"
              fontWeight="bold"
              marginBottom="m"
              style={{ textTransform: "uppercase", letterSpacing: 1 }}
              color="bodyTextColor"
              opacity={0.6}
            >
              General
            </CustomText>
            <Box
              backgroundColor="mainBackgroundColor"
              borderRadius={16}
              borderWidth={1}
              borderColor="borderColor"
              overflow="hidden"
            >
              {/* Subscription Plan */}
              <Pressable>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  padding="m"
                  borderBottomWidth={1}
                  borderBottomColor="borderColor"
                >
                  <Box flexDirection="row" alignItems="center" gap="m">
                    <Card
                      size={24}
                      color={theme.colors.bodyTextColor}
                      variant="Linear"
                    />
                    <CustomText variant="body" fontWeight="500">
                      Subscription Plan
                    </CustomText>
                  </Box>
                  <Box flexDirection="row" alignItems="center" gap="s">
                    <CustomText
                      variant="body"
                      color="primaryColor"
                      fontWeight="bold"
                    >
                      Pro
                    </CustomText>
                    <ArrowRight2
                      size={16}
                      color={theme.colors.bodyTextColor}
                      opacity={0.5}
                    />
                  </Box>
                </Box>
              </Pressable>

              {/* Notifications */}
              <Pressable>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  padding="m"
                  borderBottomWidth={1}
                  borderBottomColor="borderColor"
                >
                  <Box flexDirection="row" alignItems="center" gap="m">
                    <Notification
                      size={24}
                      color={theme.colors.bodyTextColor}
                      variant="Linear"
                    />
                    <CustomText variant="body" fontWeight="500">
                      Notifications
                    </CustomText>
                  </Box>
                  <ArrowRight2
                    size={16}
                    color={theme.colors.bodyTextColor}
                    opacity={0.5}
                  />
                </Box>
              </Pressable>

              {/* Dark Mode */}
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                padding="m"
              >
                <Box flexDirection="row" alignItems="center" gap="m">
                  <Moon
                    size={24}
                    color={theme.colors.bodyTextColor}
                    variant="Linear"
                  />
                  <CustomText variant="body" fontWeight="500">
                    Dark Mode
                  </CustomText>
                </Box>
                <Switch
                  value={darkMode}
                  onValueChange={handleToggleDarkMode}
                  trackColor={{
                    false: "#767577",
                    true: theme.colors.primaryColor,
                  }}
                  thumbColor={"#f4f3f4"}
                />
              </Box>
            </Box>
          </Box>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => ({
              backgroundColor: "#FF3B30",
              paddingVertical: 16,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: pressed ? 0.8 : 1,
              marginBottom: 20,
            })}
          >
            <LogoutCurve size={24} color="white" variant="Outline" />
            <CustomText variant="body" color="white" fontWeight="bold">
              Logout
            </CustomText>
          </Pressable>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
