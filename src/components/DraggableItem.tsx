import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Layer } from "../editor/types";

interface DraggableItemProps {
  layer: Layer;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Layer>) => void;
  canvasScale: number;
  canvasSize: { width: number; height: number };
  children: React.ReactNode;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  layer,
  isSelected,
  onSelect,
  onUpdate,
  canvasScale,
  canvasSize,
  children,
}) => {
  const translateX = useSharedValue(layer.x);
  const translateY = useSharedValue(layer.y);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(layer.rotation);

  useEffect(() => {
    translateX.value = layer.x;
    translateY.value = layer.y;
    rotation.value = layer.rotation;
  }, [layer.x, layer.y, layer.rotation]);

  const context = useSharedValue({ x: 0, y: 0, rotation: 0, scale: 1 });

  const panGesture = Gesture.Pan()
    .enabled(!layer.locked)
    .onStart(() => {
      context.value = {
        x: translateX.value,
        y: translateY.value,
        rotation: rotation.value,
        scale: 1,
      };
      runOnJS(onSelect)();
    })
    .onUpdate((event) => {
      let newX = context.value.x + event.translationX / canvasScale;
      let newY = context.value.y + event.translationY / canvasScale;

      // Constrain movement to keep at least 20px visible
      const minX = -layer.width + 20;
      const maxX = canvasSize.width - 20;
      const minY = -layer.height + 20;
      const maxY = canvasSize.height - 20;

      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));

      translateX.value = newX;
      translateY.value = newY;
    })
    .onEnd(() => {
      runOnJS(onUpdate)({
        x: translateX.value,
        y: translateY.value,
      });
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(!layer.locked && isSelected)
    .onStart(() => {
      context.value.scale = 1;
    })
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      const newWidth = layer.width * scale.value;
      const newHeight = layer.height * scale.value;
      runOnJS(onUpdate)({
        width: newWidth,
        height: newHeight,
      });
      scale.value = 1;
    });

  const rotationGesture = Gesture.Rotation()
    .enabled(!layer.locked && isSelected)
    .onStart(() => {
      context.value.rotation = rotation.value;
    })
    .onUpdate((event) => {
      rotation.value = context.value.rotation + event.rotation;
    })
    .onEnd(() => {
      runOnJS(onUpdate)({
        rotation: rotation.value,
      });
    });

  const composedGesture = Gesture.Simultaneous(
    panGesture,
    Gesture.Simultaneous(pinchGesture, rotationGesture),
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: withSpring(scale.value) },
      { rotate: `${rotation.value}rad` },
    ],
    width: layer.width,
    height: layer.height,
    zIndex: layer.zIndex,
    opacity: layer.opacity,
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={[styles.container, animatedStyle, isSelected && styles.selected]}
      >
        {children}

        {isSelected && !layer.locked && (
          <View style={styles.controls} pointerEvents="none">
            <View style={styles.resizeHandle} />
            <View style={styles.rotateHandle} />
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: "#0099ff",
    borderStyle: "dashed",
  },
  controls: {
    ...StyleSheet.absoluteFillObject,
  },
  resizeHandle: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 12,
    height: 12,
    backgroundColor: "#0099ff",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  rotateHandle: {
    position: "absolute",
    right: -6,
    top: -6,
    width: 12,
    height: 12,
    backgroundColor: "#00ff99",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
