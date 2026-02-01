import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import { useUserAuth } from "@/hooks/useUserAuth";
import { RootState } from "@/states";
import { updateDetails } from "@/states/slices/user.reducer";
import { Theme } from "@/utils/theme";
import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";
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

  useEffect(() => {
    if (!token) return;
    if (token && data?.data && !isError && !isLoading) {
      console.log("DATA", data?.data);
      dispatch(updateDetails(data?.data));
      router.push("/dashboard/home");
    }
  }, [data?.data, dispatch, isError, isLoading, token]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
        colors={["#C27AFF", "#51A2FF", "#DAB2FF"]}
      >
        <Box
          width={100}
          height={100}
          borderRadius={12}
          justifyContent="center"
          alignItems="center"
          backgroundColor="mainBackgroundColor"
        >
          <Sparkles size={50} color={theme.colors.primaryColor} />
        </Box>
        <Box height={20} />
        <Button
          width={"100%"}
          height={50}
          borderRadius={12}
          backgroundColor="red"
          color="white"
          title="Continue"
          onPress={() => router.push("/login")}
        />
      </LinearGradient>
    </View>
  );
}
