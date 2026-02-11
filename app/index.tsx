import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import { useUserAuth } from "@/hooks/useUserAuth";
import { RootState } from "@/states";
import { updateDetails } from "@/states/slices/user.reducer";
import { Theme } from "@/utils/theme";
import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { CalendarDays, Sparkles, Users } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, SafeAreaView, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Index() {
  const theme = useTheme<Theme>();
  const { useUserDetails } = useUserAuth();
  const { token } = useSelector((state: RootState) => ({
    user: state.user,
    token: state.token,
  }));
  const { data, isLoading, isError } = useUserDetails();
  const dispatch = useDispatch();
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(24)).current;
  const cardLeft = useRef(new Animated.Value(28)).current;
  const cardRight = useRef(new Animated.Value(-28)).current;
  const cardTop = useRef(new Animated.Value(-20)).current;
  const floating = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log("Index Check:", {
      token: !!token,
      data: !!data,
      isError,
      isLoading,
    });
    if (!token) return;
    if (token && data?.data && !isError && !isLoading) {
      dispatch(updateDetails(data?.data));
      router.push("/dashboard/home");
    }
  }, [data?.data, dispatch, isError, isLoading, token]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(cardLeft, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(cardRight, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(cardTop, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floating, {
          toValue: 1,
          duration: 1700,
          useNativeDriver: true,
        }),
        Animated.timing(floating, {
          toValue: 0,
          duration: 1700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [cardLeft, cardRight, cardTop, floating, heroOpacity, heroTranslateY]);

  const floatY = floating.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const pulse = floating.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111217" }}>
      <LinearGradient
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 22,
          paddingVertical: 24,
        }}
        colors={["#A46CFF", "#4C9EF8", "#B996F7"]}
        start={{ x: 0.05, y: 0.05 }}
        end={{ x: 0.95, y: 0.95 }}
      >
        <Animated.View
          style={{
            width: "100%",
            maxWidth: 430,
            borderRadius: 24,
            paddingHorizontal: 24,
            paddingVertical: 32,
            backgroundColor: "rgba(255,255,255,0.08)",
            opacity: heroOpacity,
            transform: [{ translateY: heroTranslateY }],
          }}
        >
          <View style={{ alignItems: "center", marginBottom: 26 }}>
            <Animated.View
              style={{
                width: 260,
                height: 210,
                transform: [{ translateY: floatY }],
              }}
            >
              <Animated.View
                style={{
                  position: "absolute",
                  left: 28,
                  top: 0,
                  width: 132,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  shadowColor: "#0A102A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.16,
                  shadowRadius: 12,
                  elevation: 6,
                  transform: [{ translateY: cardTop }],
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <CalendarDays size={16} color="#6B2EFF" />
                  <View
                    style={{
                      marginLeft: 8,
                      height: 6,
                      flex: 1,
                      borderRadius: 4,
                      backgroundColor: "#CFAAFB",
                    }}
                  />
                </View>
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 78,
                  width: 162,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: "rgba(255,255,255,0.92)",
                  shadowColor: "#0A102A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.16,
                  shadowRadius: 12,
                  elevation: 6,
                  transform: [{ translateX: cardLeft }],
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Users size={16} color="#2E7BFF" />
                  <View
                    style={{
                      marginLeft: 8,
                      height: 6,
                      flex: 1,
                      borderRadius: 4,
                      backgroundColor: "#A8C8FF",
                    }}
                  />
                </View>
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  right: 2,
                  top: 52,
                  width: 134,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  shadowColor: "#0A102A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.16,
                  shadowRadius: 12,
                  elevation: 6,
                  transform: [{ translateX: cardRight }],
                }}
              >
                <View style={{ flexDirection: "row", marginBottom: 6 }}>
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "#6B54E8",
                      marginRight: 4,
                    }}
                  />
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: "#91A5FF",
                    }}
                  />
                </View>
                <CustomText
                  variant="body"
                  style={{
                    color: "#2E3342",
                    fontSize: 10,
                    fontWeight: "600",
                  }}
                >
                  NEW FOLLOWERS
                </CustomText>
                <CustomText
                  variant="body"
                  style={{
                    color: "#131722",
                    fontSize: 28,
                    fontWeight: "700",
                    lineHeight: 30,
                  }}
                >
                  22
                </CustomText>
              </Animated.View>
              <Animated.View
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 86,
                  marginLeft: -36,
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  backgroundColor: "rgba(255,255,255,0.95)",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#0A102A",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.16,
                  shadowRadius: 12,
                  elevation: 8,
                  transform: [{ scale: pulse }],
                }}
              >
                <Sparkles size={30} color={theme.colors.primaryColor} />
              </Animated.View>
            </Animated.View>
          </View>

          <View style={{ marginTop: 8, alignItems: "center" }}>
            <CustomText
              variant="regularHeader"
              style={{
                color: "white",
                fontSize: 46,
                lineHeight: 50,
                fontWeight: "700",
                textAlign: "center",
                letterSpacing: 0.2,
              }}
            >
              Pagis
            </CustomText>
            <CustomText
              variant="body"
              style={{
                marginTop: 8,
                color: "rgba(255,255,255,0.9)",
                fontSize: 21,
                textAlign: "center",
              }}
            >
              Create. Schedule. Grow.
            </CustomText>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              activeOpacity={0.88}
              style={{
                marginTop: 28,
                backgroundColor: "rgba(255,255,255,0.96)",
                borderRadius: 999,
                paddingHorizontal: 30,
                paddingVertical: 14,
                shadowColor: "#193265",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 7,
              }}
            >
              <CustomText
                variant="body"
                style={{
                  color: theme.colors.primaryColor,
                  fontWeight: "700",
                  fontSize: 20,
                }}
              >
                Get Started
              </CustomText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}
