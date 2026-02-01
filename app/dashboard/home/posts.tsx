import Editor from "@/components/screens/Editor";
import Box from "@/components/ui/Box";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Posts = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <Editor />
      </Box>
    </SafeAreaView>
  );
};

export default Posts;
