import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import { RootState } from "@/states";
import {
  setAccountType,
  setCurrentPage,
} from "@/states/slices/account-setup-reducer";
import { Theme } from "@/utils/theme";
import { createBox } from "@shopify/restyle";
import { Building3, User } from "iconsax-react-nativejs";
import React from "react";
import { Pressable, PressableProps } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

const PressableBox = createBox<Theme, PressableProps>(Pressable);

const ACCOUNT_TYPES: {
  type: "PERSONAL" | "BUSINESS";
  name: string;
  description: string;
}[] = [
  {
    type: "PERSONAL",
    name: "Personal",
    description: "For individuals who use Pagix for personal purposes.",
  },
  {
    type: "BUSINESS",
    name: "Business",
    description: "For businesses that use Pagix to manage their operations.",
  },
];

const AccountTypeCard = ({
  type,
  name,
  description,
  activeType,
}: {
  type: "PERSONAL" | "BUSINESS";
  name: string;
  description: string;
  activeType: "PERSONAL" | "BUSINESS" | null;
}) => {
  const dispatch = useDispatch();
  const handlePress = () => {
    dispatch(setAccountType(type));
  };
  return (
    <PressableBox
      onPress={handlePress}
      width={"100%"}
      height={123}
      borderRadius={16}
      borderWidth={2}
      borderColor="borderColor"
      flexDirection="row"
      backgroundColor="mainBackgroundColor"
      marginBottom="m"
      {...(activeType === type && {
        borderColor: "primaryColor",
      })}
    >
      <Box
        width={"30%"}
        height={"100%"}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          width={50}
          height={50}
          borderRadius={16}
          backgroundColor="secondaryBackgroundColor"
          justifyContent="center"
          alignItems="center"
        >
          {type === "BUSINESS" && (
            <Building3 variant="Linear" size={30} color={"grey"} />
          )}
          {type === "PERSONAL" && (
            <User variant="Linear" size={30} color={"grey"} />
          )}
        </Box>
      </Box>
      <Box
        width={"70%"}
        height={"100%"}
        justifyContent="center"
        alignItems="flex-start"
      >
        <CustomText variant="header" color="headerTextColor" fontSize={24}>
          {name}
        </CustomText>
        <CustomText variant="body" mt="s" color="bodyTextColor">
          {description}
        </CustomText>
      </Box>
    </PressableBox>
  );
};

const AxcountType = () => {
  const selectedType = useSelector(
    (state: RootState) => state.accountSetup.accountType
  );
  const currentPage = useSelector(
    (state: RootState) => state.accountSetup.currentPage
  );
  const dispatch = useDispatch();

  const handlePress = () => {
    if (!selectedType) {
      Toast.error("Please select an account type");
      return;
    }
    dispatch(setCurrentPage(currentPage + 1));
  };

  return (
    <Box flex={1} paddingTop="m">
      <CustomText variant="header" fontSize={28}>
        Welcome! 👋
      </CustomText>
      <CustomText variant="body" mt="s">
        How will you be using pagis?
      </CustomText>
      <Box flex={1} justifyContent="center" alignItems="center" mt="l">
        {ACCOUNT_TYPES.map(({ type, name, description }) => (
          <AccountTypeCard
            activeType={selectedType}
            key={type}
            type={type}
            name={name}
            description={description}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AxcountType;
