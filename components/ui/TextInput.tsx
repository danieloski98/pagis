import { Theme } from '@/utils/theme';
import { useTheme } from '@shopify/restyle';
import { useFormikContext } from 'formik';
import React, { JSX, useState } from 'react';
import { DimensionValue, TextInput, TextInputProps } from 'react-native';
import Box from './Box';
import CustomText from './CustomText';

interface IProps extends TextInputProps {
    name: string;
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    leftIcon?: JSX.Element;
    rightIcon?: JSX.Element;
}

const CustomTextInput = (props: IProps) => {
  const { width = '100%', height = 45, borderRadius = 12, name, leftIcon, rightIcon, ...rest } = props;

  // states
  const [isFocused, setIsFocused] = useState(false);

  // formik context
  const { errors, touched, dirty, values, handleChange } = useFormikContext<{ [key: string]: string }>();
 const theme = useTheme<Theme>();
  return (
    <Box width={width}>
      <Box width="100%" height={height} borderRadius={borderRadius} flexDirection='row' borderWidth={isFocused ? 2 : 0} paddingHorizontal='m' backgroundColor='mainBackgroundColor' alignItems='center' style={{
        borderColor: errors[name] && touched[name] ? theme.colors.error : theme.colors.primaryColor,
      }}>
        { leftIcon && leftIcon }
        <TextInput
          style={{ flex: 1 }}
          focusable
          value={values[name]}
          onChangeText={handleChange(name)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
        { rightIcon && rightIcon }
      </Box>
      {errors[name] && touched[name] && (
        <CustomText style={{ color: theme.colors.error, marginTop: 4, fontSize: 12 }}>
            {errors[name]}
        </CustomText>
      )}
    </Box>
  )
}

export default CustomTextInput