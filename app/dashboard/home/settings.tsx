import CustomText from "@/components/ui/CustomText";
import { Theme } from "@/utils/theme";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { FontAwesome } from "@expo/vector-icons";
import { createBox, useTheme } from "@shopify/restyle";
import {
  ArrowRight2,
  Card,
  LogoutCurve,
  Moon,
  Notification,
} from "iconsax-react-nativejs";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";

const Box = createBox<Theme>();

const Settings = () => {
  const theme = useTheme<Theme>();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const avatar = useMemo(() => {
    return createAvatar(initials, {
      seed: "John Doe",
      fontFamily: ["Arial", "Verdana"],
    }).toString();
  }, []);

  const connectedAccounts = [
    {
      id: 1,
      name: "Facebook",
      icon: <FontAwesome name="facebook" size={20} color="#1877F2" />,
      connected: true,
    },
    {
      id: 2,
      name: "Instagram",
      icon: <FontAwesome name="instagram" size={20} color="#E4405F" />,
      connected: true,
    },
    {
      id: 3,
      name: "Twitter",
      icon: <FontAwesome name="twitter" size={20} color="#1DA1F2" />,
      connected: false,
    },
  ];

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
                  John Doe
                </CustomText>
                <CustomText variant="body" color="bodyTextColor" opacity={0.6}>
                  john.doe@email.com
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
              {connectedAccounts.map((account, index) => (
                <Box
                  key={account.id}
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
                  <Box
                    paddingHorizontal="s"
                    paddingVertical="s"
                    borderRadius={12}
                    opacity={account.connected ? 1 : 0.5}
                    style={{
                      backgroundColor: account.connected
                        ? "#E8F5E9"
                        : "#F5F5F5",
                    }}
                  >
                    <CustomText
                      variant="body"
                      fontWeight="bold"
                      style={{
                        color: account.connected ? "#2E7D32" : "#757575",
                        fontSize: 12,
                      }}
                    >
                      {account.connected ? "Connected" : "Not Connected"}
                    </CustomText>
                  </Box>
                </Box>
              ))}
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
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
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
