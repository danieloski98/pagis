import { createTheme } from '@shopify/restyle';

const palette = {
  primaryColor: '#AD46FF',
  mainBackgroundColor: '#ffffff',
  secondaryBackgroundColor: 'whitesmoke',
  bodyTextColor: '#4A5565',
  headerTextColor: '#101828',
  buttonBgColor: '#2B7FFF',
  borderColor: '#E5E7EB',

  black: '#0B0B0B',
  white: '#F0F2F3',
  error: '#FF4D4F',
};

const darkPalette = {
  ...palette,
  mainBackgroundColor: '#0B0B0B',
  secondaryBackgroundColor: '#101828',
  bodyTextColor: '#F0F2F3',
  headerTextColor: '#ffffff',
  buttonBgColor: '#2B7FFF',
  borderColor: '#2B7FFF',
};

const theme = createTheme({
  colors: {
    ...palette,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
    '2xl': 48,
    '3xl': 56,
    '4xl': 64,
  },
  textVariants: {
    header: {
      fontSize: 34,
    },
    body: {
      fontSize: 14,
      lineHeight: 24,
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
});

const darkTheme = createTheme({
  colors: {
    ...darkPalette,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
    '2xl': 48,
    '3xl': 56,
    '4xl': 64,
  },
  textVariants: {
    header: {
      fontSize: 34,
      fontFamily: 'PlayfairDisplay-Bold',
    },
    body: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
    },
    medium: {
        fontSize: 16,
        fontFamily: 'PlayfairDisplay-Medium',
    },
    defaults: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
      // We can define a default text variant here.
    },
  },
});

export type Theme = typeof theme;
export default theme;