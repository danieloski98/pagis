import { Theme } from '@/utils/theme';
import { useFormikContext } from 'formik';
import React from 'react';
import { ActivityIndicator, DimensionValue, Pressable } from 'react-native';
import CustomText from './CustomText';

type BtnType = 'FLAT'|'OUTLINE';

interface IProps {
    title: string;
    width?: DimensionValue;
    height?: DimensionValue;
    onPress: () => void;
    backgroundColor?: keyof Theme['colors'];
    color?: string;
    borderWidth?: number;
    borderRadius?: number;
    type?: BtnType;
    isLoading?: boolean;
}

const SubmitButton = ({
    title,
    width = '100%',
    height = 45,
    backgroundColor = 'primaryColor',
    color = 'white',
    borderWidth = 0,
    borderRadius = 8,
    type = 'FLAT',
    isLoading = false,
}: IProps) => {
    const { handleSubmit } = useFormikContext();
  return (
    <Pressable 
    onPress={() => handleSubmit()}
    style={{
        width,
        height,
        backgroundColor,
        borderWidth,
        borderRadius,
    }}>
        {isLoading ? (
            <ActivityIndicator color={color} />
        ) : (
            <CustomText style={{
                color,
            }}>{title}</CustomText>
        )}  
    </Pressable>
  )
}

export default SubmitButton