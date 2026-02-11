import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ImageSearchModal } from "./ImageSearchModal";

interface ToolbarProps {
  onAddText: () => void;
  onAddShape: (type: "rect" | "circle" | "triangle") => void;
  onAddImage: (uri: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddText,
  onAddShape,
  onAddImage,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hasSelection,
}) => {
  const [showImageSearch, setShowImageSearch] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onAddImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.group}>
          <TouchableOpacity
            style={[styles.button, !canUndo && styles.disabled]}
            onPress={onUndo}
            disabled={!canUndo}
          >
            <Ionicons name="arrow-undo" size={24} color="#333" />
            <Text style={styles.label}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, !canRedo && styles.disabled]}
            onPress={onRedo}
            disabled={!canRedo}
          >
            <Ionicons name="arrow-redo" size={24} color="#333" />
            <Text style={styles.label}>Redo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.group}>
          <TouchableOpacity style={styles.button} onPress={onAddText}>
            <Ionicons name="text" size={24} color="#333" />
            <Text style={styles.label}>Text</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#333" />
            <Text style={styles.label}>Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowImageSearch(true)}
          >
            <Ionicons name="search" size={24} color="#333" />
            <Text style={styles.label}>Online</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onAddShape("rect")}
          >
            <Ionicons name="square" size={24} color="#333" />
            <Text style={styles.label}>Square</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onAddShape("circle")}
          >
            <Ionicons name="ellipse" size={24} color="#333" />
            <Text style={styles.label}>Circle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => onAddShape("triangle")}
          >
            <Ionicons name="triangle" size={24} color="#333" />
            <Text style={styles.label}>Triangle</Text>
          </TouchableOpacity>
        </View>

        {hasSelection && (
          <>
            <View style={styles.divider} />

            <View style={styles.group}>
              <TouchableOpacity style={styles.button} onPress={onDuplicate}>
                <Ionicons name="copy" size={24} color="#333" />
                <Text style={styles.label}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={onBringForward}>
                <Ionicons name="arrow-up" size={24} color="#333" />
                <Text style={styles.label}>Up</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={onSendBackward}>
                <Ionicons name="arrow-down" size={24} color="#333" />
                <Text style={styles.label}>Down</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.delete]}
                onPress={onDelete}
              >
                <Ionicons name="trash" size={24} color="#ff4444" />
                <Text style={[styles.label, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <ImageSearchModal
        visible={showImageSearch}
        onClose={() => setShowImageSearch(false)}
        onSelectImage={(uri) => {
          onAddImage(uri);
          setShowImageSearch(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
    maxHeight: 80,
  },
  group: {
    flexDirection: "row",
    paddingHorizontal: 8,
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 60,
  },
  disabled: {
    opacity: 0.3,
  },
  delete: {
    marginLeft: 8,
  },
  deleteText: {
    color: "#ff4444",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },
  divider: {
    width: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
    height: 40,
  },
});
