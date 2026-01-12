import AccountType from "@/components/screens/account-setup/Account-Type";
import CategorySelection from "@/components/screens/account-setup/CategorySelection";
import Details from "@/components/screens/account-setup/Details";
import PaymentSelection from "@/components/screens/account-setup/PaymentSelection";
import Box from "@/components/ui/Box";
import Button from "@/components/ui/Button";
import CustomProgressbar from "@/components/ui/CustomProgressbar";
import { usePayment } from "@/hooks/usePayment";
import { useUserAuth } from "@/hooks/useUserAuth";
import { RootState } from "@/states";
import { setCurrentPage } from "@/states/slices/account-setup-reducer";
import { Theme } from "@/utils/theme";
import { useTheme } from "@shopify/restyle";
import { router } from "expo-router";
import { ArrowLeft } from "iconsax-react-nativejs";
import React, { useCallback, useMemo, useState } from "react";
import { Platform, StatusBar } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { usePaystack } from "react-native-paystack-webview";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

const paddingTop = Platform.OS === "android" ? StatusBar.currentHeight : 80;

enum PAGES {
  DETAILS = 1,
  ACCOUNT_TYPE = 2,
  CATEGORY = 3,
  PAYMENT = 4,
}

const AccountSetup = () => {
  // states
  const [reference, setReference] = useState<null | string>(null);
  const theme = useTheme<Theme>();
  const { createPayment, verifyPayment } = usePayment();
  const { updateUser } = useUserAuth();
  const user = useSelector((state: RootState) => state.user);
  const { accountType, category, selectedPlan, firstName, lastName } =
    useSelector((state: RootState) => state.accountSetup);

  // paystack ref
  const { popup } = usePaystack();

  // create payment mutation
  const { mutate: createPaymentMutate, isPending: createPaymentLoading } =
    createPayment;

  // verify payment mutation
  const { mutate: verifyPaymentMutate, isPending: verifyPaymentLoading } =
    verifyPayment;

  const dispatch = useDispatch();
  const TOTAL_STEPS = 3;
  const currentPage = useSelector(
    (state: RootState) => state.accountSetup.currentPage
  );

  const renderPage = useCallback(() => {
    switch (currentPage) {
      case PAGES.DETAILS:
        return <Details />;
      case PAGES.ACCOUNT_TYPE:
        return <AccountType />;
      case PAGES.CATEGORY:
        return <CategorySelection />;
      case PAGES.PAYMENT:
        return <PaymentSelection />;
      default:
        return null;
    }
  }, [currentPage]);

  const disableCheck = useMemo(() => {
    if (
      currentPage === PAGES.DETAILS &&
      (!user?.firstName || !user?.lastName)
    ) {
      return true;
    }
    if (currentPage === PAGES.ACCOUNT_TYPE) {
      return !accountType;
    } else if (currentPage === PAGES.CATEGORY) {
      return !category;
    }
    return false;
  }, [currentPage, accountType, category, user]);

  const handleBackPress = () => {
    if (currentPage === PAGES.ACCOUNT_TYPE) {
      Toast.info("You can't go back");
    } else {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  // first step create the payment
  const handleCreatePayment = () => {
    const obj = {
      planId: selectedPlan?._id as string,
      userId: user?._id as string,
    };

    createPaymentMutate(
      { body: obj, params: null },
      {
        onSuccess: (data) => {
          console.log("PAYMENT", data);
          // if plan amount is 0 verify the payment immediately
          if (selectedPlan?.price === 0) {
            verifyPaymentMutate(
              { paymentId: data?.data?._id as string },
              {
                onSuccess: (data) => {
                  Toast.success("Payment verified");
                  // update user details
                  updateUser.mutate(
                    {
                      body: {
                        accountType: accountType as any,
                        category,
                        firstName: firstName as any,
                        lastName: lastName as any,
                      },
                      params: { id: user?._id as string },
                    },
                    {
                      onSuccess: (data) => {
                        Toast.success("Account setup completed");
                        router.push("/dashboard/home");
                        dispatch(setCurrentPage(currentPage + 1));
                      },
                    }
                  );
                },
                onError: (error) => {
                  Toast.error(error.message);
                },
              }
            );
            return;
          }
          setReference(data?.data?._id as string);
          popup.newTransaction({
            reference: data?.data?._id as string,
            amount: selectedPlan?.price as number,
            email: user?.email,
            onSuccess: (ndata) => {
              Toast.success("Payment successful");
              verifyPaymentMutate(
                { paymentId: data?.data?._id as string },
                {
                  onSuccess: (data) => {
                    Toast.success("Payment verified");
                    // update user details
                    updateUser.mutate(
                      {
                        body: {
                          accountType: accountType as any,
                          category,
                          firstName: firstName as any,
                          lastName: lastName as any,
                        },
                        params: { id: user?._id as string },
                      },
                      {
                        onSuccess: (data) => {
                          Toast.success("Account setup completed");
                          router.push("/dashboard/home");
                          dispatch(setCurrentPage(currentPage + 1));
                        },
                      }
                    );
                  },
                  onError: (error) => {
                    Toast.error(error.message);
                  },
                }
              );
            },
            onCancel: () => {
              Toast.info("Payment cancelled");
            },
            onError: (error) => {
              Toast.error(error.message);
            },
            onLoad: () => {
              Toast.info("Loading...");
            },
          });
        },
      }
    );
  };

  const handlePress = () => {
    if (currentPage === PAGES.DETAILS && disableCheck) {
      Toast.info("Please fill in your details");
      return;
    }
    if (disableCheck && currentPage === PAGES.ACCOUNT_TYPE) {
      Toast.info("Please select your account type");
      return;
    } else if (disableCheck && currentPage === PAGES.CATEGORY) {
      Toast.info("Please select your category");
      return;
    } else if (disableCheck && currentPage === PAGES.PAYMENT) {
      Toast.info("Please select your payment method");
      return;
    } else if (currentPage === PAGES.PAYMENT && selectedPlan) {
      handleCreatePayment();
    } else {
      dispatch(setCurrentPage(currentPage + 1));
    }
  };

  return (
    <Box flex={1} style={{ paddingTop: paddingTop }}>
      <Box paddingHorizontal="m" mt="l">
        <Pressable
          style={{
            width: 50,
            height: 50,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.mainBackgroundColor,
            marginBottom: 20,
          }}
          onPress={handleBackPress}
        >
          <ArrowLeft size={20} color={theme.colors.primaryColor} />
        </Pressable>
        <CustomProgressbar totalSteps={TOTAL_STEPS} currentStep={currentPage} />
      </Box>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
      >
        {renderPage()}
      </ScrollView>
      <Box
        width={"100%"}
        height={120}
        bg="mainBackgroundColor"
        paddingHorizontal="m"
      >
        {currentPage !== PAGES.DETAILS && (
          <Button
            title="Continue"
            onPress={handlePress}
            width={"100%"}
            height={55}
            borderRadius={16}
            disabled={disableCheck}
            isLoading={createPaymentLoading || verifyPaymentLoading}
          />
        )}
      </Box>
    </Box>
  );
};

export default AccountSetup;
