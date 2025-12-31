import Box from '@/components/ui/Box';
import Button from '@/components/ui/Button';
import { Theme } from '@/utils/theme';
import { useTheme } from '@shopify/restyle';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { View } from "react-native";

export default function Index() {
  const theme = useTheme<Theme>()
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LinearGradient 
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
      }}
      colors={[
        "#C27AFF",
        "#51A2FF",
        "#DAB2FF"
      ]}>

        <Box width={100} height={100} borderRadius={12} justifyContent='center' alignItems='center' backgroundColor='mainBackgroundColor'>
          <Sparkles size={50} color={theme.colors.primaryColor} />
        </Box>
        <Box height={20} />
        <Button width={'100%'} height={50} borderRadius={12} backgroundColor='red' color='white' title='Continue' onPress={() => router.push('/login')} />
      </LinearGradient>
    </View>
  );
}
