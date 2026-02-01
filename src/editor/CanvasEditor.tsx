/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LayerRenderer } from "../components/LayerRenderer";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { Toolbar } from "../components/Toolbar";
import { useCanvas } from "./hooks/useCanvas";
import { CANVAS_PRESETS, CanvasSize } from "./types";

// Mock ViewShot for web compatibility, use real one for mobile
let ViewShot: any = View;
try {
  ViewShot = require("react-native-view-shot").default;
} catch (e) {
  // Fallback for web
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export interface CanvasEditorRef {
  exportImage: () => Promise<string | null>;
  getLayers: () => any[];
}

interface CanvasEditorProps {
  initialSize?: CanvasSize;
  onExport?: (uri: string) => void;
  style?: any;
}

export const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ initialSize = CANVAS_PRESETS.instagram, onExport, style }, ref) => {
    const {
      layers,
      selectedId,
      canvasSize,
      setSelectedId,
      addLayer,
      updateLayer,
      deleteLayer,
      moveLayer,
      duplicateLayer,
      undo,
      redo,
      canUndo,
      canRedo,
    } = useCanvas(initialSize);

    const [showProperties, setShowProperties] = useState(false);
    const canvasRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      exportImage: async () => {
        if (canvasRef.current && canvasRef.current.capture) {
          try {
            const uri = await canvasRef.current.capture();
            onExport?.(uri);
            return uri;
          } catch (err) {
            console.error("Export failed:", err);
            return null;
          }
        }
        return null;
      },
      getLayers: () => layers,
    }));

    const handleAddText = () => {
      addLayer({
        type: "text",
        x: canvasSize.width / 2 - 100,
        y: canvasSize.height / 2 - 30,
        width: 200,
        height: 60,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        content: "Double tap to edit",
        fontSize: 24,
        fontColor: "#000000",
        fontFamily: "Inter-Regular",
      });
    };

    const handleAddShape = (shapeType: "rect" | "circle" | "triangle") => {
      addLayer({
        type: "shape",
        x: canvasSize.width / 2 - 50,
        y: canvasSize.height / 2 - 50,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        shapeType,
        backgroundColor: "#cccccc",
      });
    };

    const handleAddImage = (uri: string) => {
      addLayer({
        type: "image",
        x: canvasSize.width / 2 - 100,
        y: canvasSize.height / 2 - 100,
        width: 200,
        height: 200,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        imageUri: uri,
      });
    };

    const selectedLayer = layers.find((l) => l.id === selectedId) || null;

    // Calculate scale to fit canvas in screen
    const calculateScale = () => {
      const padding = 40;
      const availableWidth =
        screenWidth - (showProperties ? 320 : 40) - padding;
      const availableHeight = screenHeight - 180; // Account for toolbar and statusbar

      const scaleX = availableWidth / canvasSize.width;
      const scaleY = availableHeight / canvasSize.height;
      return Math.min(scaleX, scaleY, 1);
    };

    const currentScale = calculateScale();

    // Sort layers by zIndex
    const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

    const translateX = -(canvasSize.width * (1 - currentScale)) / 2;
    const translateY = -(canvasSize.height * (1 - currentScale)) / 2;

    return (
      <GestureHandlerRootView style={[styles.container, style]}>
        <StatusBar style="dark" />

        <Toolbar
          onAddText={handleAddText}
          onAddShape={handleAddShape}
          onAddImage={handleAddImage}
          onDelete={() => selectedId && deleteLayer(selectedId)}
          onDuplicate={() => selectedId && duplicateLayer(selectedId)}
          onBringForward={() => selectedId && moveLayer(selectedId, "up")}
          onSendBackward={() => selectedId && moveLayer(selectedId, "down")}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          hasSelection={!!selectedId}
        />

        <View style={styles.mainContent}>
          <ScrollView
            style={styles.workspace}
            contentContainerStyle={styles.workspaceContent}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <TouchableWithoutFeedback onPress={() => setSelectedId(null)}>
              <View
                style={[
                  styles.canvasWrapper,
                  {
                    width: canvasSize.width * currentScale,
                    height: canvasSize.height * currentScale,
                  },
                ]}
              >
                {ViewShot ? (
                  <ViewShot
                    ref={canvasRef}
                    style={[
                      styles.canvas,
                      {
                        width: canvasSize.width,
                        height: canvasSize.height,
                        transform: [
                          { translateX },
                          { translateY },
                          { scale: currentScale },
                        ],
                      },
                    ]}
                    options={{ format: "png", quality: 1, result: "tmpfile" }}
                  >
                    <View style={styles.canvasBackground}>
                      {/* Grid Background */}
                      <View style={StyleSheet.absoluteFillObject}>
                        {[...Array(20)].map((_, i) => (
                          <View
                            key={`h${i}`}
                            style={[
                              styles.gridLine,
                              {
                                top: (canvasSize.height / 20) * i,
                                width: canvasSize.width,
                              },
                            ]}
                          />
                        ))}
                        {[...Array(20)].map((_, i) => (
                          <View
                            key={`v${i}`}
                            style={[
                              styles.gridLineVertical,
                              {
                                left: (canvasSize.width / 20) * i,
                                height: canvasSize.height,
                              },
                            ]}
                          />
                        ))}
                      </View>

                      {/* Render Layers */}
                      {sortedLayers
                        .filter((l) => l.visible)
                        .map((layer) => (
                          <LayerRenderer
                            key={layer.id}
                            layer={layer}
                            isSelected={selectedId === layer.id}
                            onSelect={() => setSelectedId(layer.id)}
                            onUpdate={(updates) =>
                              updateLayer(layer.id, updates)
                            }
                            canvasScale={currentScale}
                            canvasSize={canvasSize}
                          />
                        ))}
                    </View>
                  </ViewShot>
                ) : (
                  <View
                    style={[
                      styles.canvas,
                      { width: canvasSize.width, height: canvasSize.height },
                    ]}
                  >
                    <Text>ViewShot not available</Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>

          {showProperties && selectedLayer && (
            <PropertiesPanel
              layer={selectedLayer}
              onUpdate={(updates) =>
                selectedId && updateLayer(selectedId, updates)
              }
              onClose={() => setShowProperties(false)}
            />
          )}

          {/* Floating Properties Button */}
          {!showProperties && selectedLayer && (
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setShowProperties(true)}
            >
              <Ionicons name="settings" size={24} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </GestureHandlerRootView>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
  },
  workspace: {
    flex: 1,
  },
  workspaceContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  canvasWrapper: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  canvas: {
    backgroundColor: "#fff",
  },
  canvasBackground: {
    flex: 1,
    backgroundColor: "#fff",
  },
  gridLine: {
    position: "absolute",
    height: 1,
    backgroundColor: "#e0e0e0",
    opacity: 0.5,
  },
  gridLineVertical: {
    position: "absolute",
    width: 1,
    backgroundColor: "#e0e0e0",
    opacity: 0.5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0099ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CanvasEditor;
