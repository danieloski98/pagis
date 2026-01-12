import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import { usePayment } from "@/hooks/usePayment";
import { IPlan } from "@/modules/types/PlansType";
import { RootState } from "@/states";
import { setSelectedPlan } from "@/states/slices/account-setup-reducer";
import { Theme } from "@/utils/theme";
import { createBox, useTheme } from "@shopify/restyle";
import { TickCircle } from "iconsax-react-nativejs";
import React from "react";
import { ActivityIndicator, Pressable, PressableProps } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const PressableBox = createBox<Theme, PressableProps>(Pressable);

const PlanCard = (props: IPlan) => {
  const { name, price, features, description, _id } = props;
  const active = useSelector(
    (state: RootState) => state.accountSetup.selectedPlan
  );
  const dispatch = useDispatch();
  const isActive = active?._id === _id;

  const theme = useTheme<Theme>();
  const handlePress = () => {
    dispatch(setSelectedPlan(props));
  };
  return (
    <PressableBox
      onPress={handlePress}
      width="100%"
      borderWidth={2}
      borderColor={isActive ? "primaryColor" : "borderColor"}
      borderRadius={16}
      padding="m"
      marginBottom="m"
      backgroundColor="mainBackgroundColor"
    >
      <CustomText variant="header" fontSize={24} mb="s">
        {name}
      </CustomText>
      <CustomText variant="body" color="bodyTextColor" mb="m">
        {description}
      </CustomText>

      <Box mb="l">
        {features.map((item, index) => (
          <Box flexDirection="row" alignItems="center" mb="s" key={index}>
            <TickCircle size={20} color="#22C55E" variant="Bold" />
            <CustomText variant="body" ml="s">
              {item}
            </CustomText>
          </Box>
        ))}
      </Box>

      <Box flexDirection="row" alignItems="flex-end">
        <CustomText variant="header" fontSize={32} lineHeight={38}>
          ₦{Number(price).toLocaleString("en-NG")}
        </CustomText>
        <CustomText variant="body" color="bodyTextColor" mb="s" ml="s">
          /month
        </CustomText>
      </Box>
    </PressableBox>
  );
};

const PaymentSection = () => {
  const theme = useTheme<Theme>();
  const { useGetPlans } = usePayment();
  const { data, isLoading, error } = useGetPlans();
  console.log("PLANS", data);
  return (
    <Box flex={1} paddingTop="m">
      <CustomText variant="header" fontSize={24}>
        Choose your payment plan
      </CustomText>
      <CustomText variant="body" mt="s">
        Start with free and upgrade anytime
      </CustomText>
      {isLoading && (
        <Box
          width={"100%"}
          height={100}
          justifyContent="center"
          alignItems="center"
        >
          <ActivityIndicator size={"large"} color={theme.colors.primaryColor} />
          <CustomText variant="body" mt="s">
            Loading plans
          </CustomText>
        </Box>
      )}
      {error && (
        <Box
          width={"100%"}
          height={100}
          justifyContent="center"
          alignItems="center"
        >
          <CustomText variant="body" color="error" mt="s">
            {error.message}
          </CustomText>
        </Box>
      )}
      <Box flex={1} justifyContent="flex-end" mt="l">
        {!isLoading &&
          !error &&
          data?.data?.length &&
          data?.data?.length > 0 &&
          (data?.data as IPlan[])?.map((item, index) => (
            <PlanCard key={index} {...item} />
          ))}
      </Box>
    </Box>
  );
};

export default PaymentSection;
