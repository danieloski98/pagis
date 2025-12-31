import React from 'react';
import { ActivityIndicator, DimensionValue, Pressable } from 'react-native';
import CustomText from './CustomText';

type BtnType = 'FLAT'|'OUTLINE';

interface IProps {
    title: string;
    width?: DimensionValue;
    height?: DimensionValue;
    onPress: () => void;
    backgroundColor?: string;
    color?: string;
    borderWidth?: number;
    borderRadius?: number;
    type?: BtnType;
    isLoading?: boolean;
}

const Button = ({
    title,
    width = '100%',
    height = 45,
    onPress,
    backgroundColor = 'blue',
    color = 'white',
    borderWidth = 0,
    borderRadius = 8,
    type = 'FLAT',
    isLoading = false,
}: IProps) => {
  return (
    <Pressable 
    onPress={onPress}
    style={{
        width,
        height,
        backgroundColor,
        borderWidth,
        borderRadius,
        justifyContent: 'center',
        alignItems: 'center'
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

export default Button