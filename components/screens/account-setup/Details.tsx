import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import SubmitButton from "@/components/ui/SubmitButton";
import CustomTextInput from "@/components/ui/TextInput";
import useForm from "@/hooks/useForm";
import { setCurrentPage, setName } from "@/states/slices/account-setup-reducer";
import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
});

const DetailsComponent = () => {
  const dispatch = useDispatch();

  const { renderForm } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (data) => {
      console.log(data);
      dispatch(setName(data));
      dispatch(setCurrentPage(2));
    },
  });

  return renderForm(
    <Box flex={1} paddingTop="m">
      <CustomText variant="header" fontSize={24}>
        Fill in your details
      </CustomText>
      <CustomText variant="body" mt="s">
        Help us know you better
      </CustomText>

      <Box flex={1} mt="m">
        <CustomTextInput name="firstName" placeholder="First name" />
        <Box height={20} />
        <CustomTextInput name="lastName" placeholder="Last name" />
        <SubmitButton title="Continue" width={"100%"} height={50} />
      </Box>
    </Box>
  );
};

export default DetailsComponent;
