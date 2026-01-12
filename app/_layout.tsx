import { store } from "@/states/index";
import config from "@/utils/config";
import theme from "@/utils/theme";
import { ThemeProvider } from "@shopify/restyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaystackProvider } from "react-native-paystack-webview";
import { Provider } from "react-redux";
import ToastManager from "toastify-react-native";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "PlayfairDisplay-Medium": require("../assets/fonts/PlayfairDisplay-Medium.ttf"),
    "PlayfairDisplay-Bold": require("../assets/fonts/PlayfairDisplay-Bold.ttf"),
    "PlayfairDisplay-Regular": require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
    "Archivo-Bold": require("../assets/fonts/Archivo-Bold.ttf"),
    "Archivo-Medium": require("../assets/fonts/Archivo-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if (error) {
    console.error(error);
    return null;
  }
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <ToastManager />
          <StatusBar translucent barStyle={"dark-content"} />
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PaystackProvider publicKey={config.paystackPublicKey as string}>
              <Stack screenOptions={{ headerShown: false }} />
            </PaystackProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
