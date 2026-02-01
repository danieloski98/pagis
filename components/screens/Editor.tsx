import React, { useRef } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  CANVAS_PRESETS,
  CanvasEditor,
  CanvasEditorRef,
} from "../../src/editor";

export default function App() {
  const editorRef = useRef<CanvasEditorRef>(null);

  const handleExport = async () => {
    try {
      const uri = await editorRef.current?.exportImage();
      if (uri) {
        Alert.alert(
          "Export Successful",
          `Image saved to cache. URI: ${uri.substring(0, 50)}...`,
          [{ text: "OK" }],
        );
      } else {
        Alert.alert("Export failed", "Could not capture image");
      }
    } catch (error) {
      Alert.alert("Error", String(error));
    }
  };

  const handleGetLayers = () => {
    const layers = editorRef.current?.getLayers();
    console.log("Current layers:", JSON.stringify(layers, null, 2));
    Alert.alert(
      "Layers",
      `Total layers: ${layers?.length || 0}. Check console for details.`,
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Canva Editor</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.button} onPress={handleGetLayers}>
              <Text style={styles.buttonText}>Debug</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.exportButton]}
              onPress={handleExport}
            >
              <Text style={[styles.buttonText, styles.exportButtonText]}>
                Export
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <CanvasEditor
          ref={editorRef}
          initialSize={CANVAS_PRESETS.instagram}
          style={styles.editor}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginLeft: 8,
  },
  exportButton: {
    backgroundColor: "#0099ff",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  exportButtonText: {
    color: "#fff",
  },
  editor: {
    flex: 1,
  },
});
