import Slider from "@react-native-community/slider";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Layer } from "../editor/types";

interface PropertiesPanelProps {
  layer: Layer | null;
  onUpdate: (updates: Partial<Layer>) => void;
  onClose: () => void;
}

const COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ffa500",
  "#800080",
];

const FONTS = [
  "Inter-Regular",
  "PlayfairDisplay-Regular",
  "PlayfairDisplay-Medium",
  "PlayfairDisplay-Bold",
  "Archivo-Medium",
  "Archivo-Bold",
  "Roboto-Regular",
  "Roboto-Bold",
  "Montserrat-Regular",
  "Montserrat-Bold",
  "Poppins-Regular",
  "Poppins-Bold",
  "Merriweather-Regular",
  "Merriweather-Bold",
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  layer,
  onUpdate,
  onClose,
}) => {
  if (!layer) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Properties</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Visibility & Lock */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Visible</Text>
            <Switch
              value={layer.visible}
              onValueChange={(v) => onUpdate({ visible: v })}
            />
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Locked</Text>
            <Switch
              value={layer.locked}
              onValueChange={(v) => onUpdate({ locked: v })}
            />
          </View>
        </View>

        {/* Opacity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opacity</Text>
          <View style={styles.row}>
            <Slider
              style={styles.slider}
              value={layer.opacity}
              onValueChange={(v: any) => onUpdate({ opacity: v })}
              minimumValue={0}
              maximumValue={1}
              step={0.05}
            />
            <Text style={styles.value}>{Math.round(layer.opacity * 100)}%</Text>
          </View>
        </View>

        {/* Text Specific */}
        {layer.type === "text" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Text Content</Text>
            <TextInput
              style={styles.textInput}
              value={layer.content}
              onChangeText={(t) => onUpdate({ content: t })}
              multiline
              numberOfLines={3}
            />

            <View style={styles.row}>
              <Text style={styles.label}>Font Size</Text>
              <TextInput
                style={styles.numberInput}
                value={String(layer.fontSize || 24)}
                onChangeText={(t) => onUpdate({ fontSize: Number(t) || 24 })}
                keyboardType="numeric"
              />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
              Font Family
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.fontScroll}
            >
              {FONTS.map((font) => (
                <TouchableOpacity
                  key={font}
                  style={[
                    styles.fontOption,
                    layer.fontFamily === font && styles.selectedFont,
                  ]}
                  onPress={() => onUpdate({ fontFamily: font })}
                >
                  <Text style={[styles.fontText, { fontFamily: font }]}>
                    {font.replace("-", " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>
              Text Color
            </Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorBox,
                    { backgroundColor: color },
                    layer.fontColor === color && styles.selectedColor,
                  ]}
                  onPress={() => onUpdate({ fontColor: color })}
                />
              ))}
            </View>
          </View>
        )}

        {/* Background Color */}
        {(layer.type === "shape" || layer.type === "text") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Background</Text>
            <View style={styles.colorGrid}>
              <TouchableOpacity
                style={[
                  styles.colorBox,
                  styles.transparentBox,
                  !layer.backgroundColor && styles.selectedColor,
                ]}
                onPress={() => onUpdate({ backgroundColor: undefined })}
              >
                <Text style={styles.transparentText}>Ø</Text>
              </TouchableOpacity>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorBox,
                    { backgroundColor: color },
                    layer.backgroundColor === color && styles.selectedColor,
                  ]}
                  onPress={() => onUpdate({ backgroundColor: color })}
                />
              ))}
            </View>
          </View>
        )}

        {/* Dimensions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dimensions</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Width</Text>
            <TextInput
              style={styles.numberInput}
              value={String(Math.round(layer.width))}
              onChangeText={(t) => onUpdate({ width: Number(t) || 100 })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Height</Text>
            <TextInput
              style={styles.numberInput}
              value={String(Math.round(layer.height))}
              onChangeText={(t) => onUpdate({ height: Number(t) || 100 })}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Rotation</Text>
            <TextInput
              style={styles.numberInput}
              value={String(Math.round((layer.rotation * 180) / Math.PI))}
              onChangeText={(t) => {
                const degrees = Number(t) || 0;
                onUpdate({ rotation: (degrees * Math.PI) / 180 });
              }}
              keyboardType="numeric"
            />
            <Text style={{ marginLeft: 4 }}>°</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderLeftColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeBtn: {
    padding: 4,
  },
  close: {
    fontSize: 20,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    width: 70,
    fontSize: 14,
    color: "#333",
  },
  slider: {
    flex: 1,
    height: 40,
  },
  value: {
    width: 45,
    textAlign: "right",
    fontSize: 14,
    color: "#666",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  numberInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: 70,
    textAlign: "center",
    fontSize: 14,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colorBox: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#0099ff",
  },
  transparentBox: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  transparentText: {
    fontSize: 20,
    color: "#999",
    fontWeight: "bold",
  },
  fontScroll: {
    marginBottom: 8,
  },
  fontOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  selectedFont: {
    borderColor: "#0099ff",
    backgroundColor: "#f0f9ff",
  },
  fontText: {
    fontSize: 14,
    color: "#333",
  },
});
