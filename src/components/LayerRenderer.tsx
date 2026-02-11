import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Polygon, Rect } from "react-native-svg";
import { Layer } from "../editor/types";
import { DraggableItem } from "./DraggableItem";

interface LayerRendererProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Layer>) => void;
  canvasScale: number;
  canvasSize: { width: number; height: number };
}

export const LayerRenderer: React.FC<LayerRendererProps> = (props) => {
  const { layer } = props;

  const renderContent = () => {
    switch (layer.type) {
      case "text":
        return (
          <View
            style={[
              styles.textContainer,
              { backgroundColor: layer.backgroundColor || "transparent" },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  fontSize: layer.fontSize || 24,
                  color: layer.fontColor || "#000",
                  fontFamily: layer.fontFamily,
                },
              ]}
            >
              {layer.content}
            </Text>
          </View>
        );

      case "image":
        return layer.imageUri ? (
          <Image
            source={{ uri: layer.imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={1000}
          />
        ) : (
          <View style={[styles.image, { backgroundColor: "#eee" }]} />
        );

      case "shape":
        return (
          <Svg width={layer.width} height={layer.height}>
            {layer.shapeType === "rect" && (
              <Rect
                width={layer.width}
                height={layer.height}
                fill={layer.backgroundColor || "#ccc"}
              />
            )}
            {layer.shapeType === "circle" && (
              <Circle
                cx={layer.width / 2}
                cy={layer.height / 2}
                r={Math.min(layer.width, layer.height) / 2}
                fill={layer.backgroundColor || "#ccc"}
              />
            )}
            {layer.shapeType === "triangle" && (
              <Polygon
                points={`${layer.width / 2},0 ${layer.width},${layer.height} 0,${layer.height}`}
                fill={layer.backgroundColor || "#ccc"}
              />
            )}
          </Svg>
        );

      default:
        return null;
    }
  };

  return <DraggableItem {...props}>{renderContent()}</DraggableItem>;
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
