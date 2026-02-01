import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/modules/types/CategoriesTypes";
import { RootState } from "@/states";
import { setCategory } from "@/states/slices/account-setup-reducer";
import { Theme } from "@/utils/theme";
import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { createBox, useTheme } from "@shopify/restyle";
import React, { useMemo } from "react";
import { ActivityIndicator, Pressable, PressableProps } from "react-native";
import { SvgXml } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";

const PressableBox = createBox<Theme, PressableProps>(Pressable);

const CategoryCard = ({ name, _id }: Category) => {
  const activeId = useSelector(
    (state: RootState) => state.accountSetup.category
  );
  const theme = useTheme<Theme>();
  const dispatch = useDispatch();

  const handleSelectCategory = () => {
    dispatch(setCategory(_id));
  };

  const generateSVG = useMemo(() => {
    const avatar = createAvatar(identicon, {
      seed: name,
    });

    const uri = avatar.toString();

    return (
      <Box>
        <SvgXml xml={uri} width={68} height={68} />
      </Box>
    );
  }, [name]);

  return (
    <PressableBox
      onPress={handleSelectCategory}
      borderWidth={2}
      borderRadius={16}
      width="100%"
      height={68}
      flexDirection="row"
      alignItems="center"
      marginBottom="m"
      overflow="hidden"
      borderColor={activeId === _id ? "primaryColor" : "borderColor"}
    >
      {generateSVG}
      <CustomText variant="body" ml="s">
        {name}
      </CustomText>
    </PressableBox>
  );
};

const CategorySelection = () => {
  const theme = useTheme<Theme>();
  const { useGetCategories } = useCategories();
  const { data, isLoading, error } = useGetCategories();

  return (
    <Box flex={1} paddingTop="m">
      <CustomText variant="header" fontSize={24}>
        What&apos;s your interests?
      </CustomText>
      <CustomText variant="body" mt="s">
        This helps us personalize your experience
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
            Loading categories...
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
      {!isLoading && !error && (
        <>
          <Box flex={1} justifyContent="center" alignItems="center" mt="l">
            {data?.data?.map((category) => (
              <CategoryCard key={category._id} {...category} />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default CategorySelection;
