import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { getCuratedImages, searchImages, PexelsPhoto } from "../services/pexels";

interface ImageSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectImage: (uri: string) => void;
}

const COLUMN_COUNT = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = (SCREEN_WIDTH - 48) / COLUMN_COUNT; // 48 = padding (16*3)

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  visible,
  onClose,
  onSelectImage,
}) => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchImages = useCallback(async (reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = reset ? 1 : page;
      const newImages = query
        ? await searchImages(query, nextPage)
        : await getCuratedImages(nextPage);

      if (reset) {
        setImages(newImages);
        setPage(2);
      } else {
        setImages((prev) => [...prev, ...newImages]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [query, page, loading]);

  useEffect(() => {
    if (visible) {
      fetchImages(true);
    }
  }, [visible]);

  const handleSearch = () => {
    fetchImages(true);
  };

  const renderItem = ({ item }: { item: PexelsPhoto }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => onSelectImage(item.src.large)}
    >
      <Image
        source={{ uri: item.src.medium }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.photographerContainer}>
        <Text style={styles.photographerName} numberOfLines={1}>
          {item.photographer}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Images</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search for photos..."
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => { setQuery(""); fetchImages(true); }}>
                <Ionicons name="close-circle" size={16} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          onEndReached={() => fetchImages(false)}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator size="small" color="#000" style={styles.loader} /> : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No images found</Text>
              </View>
            ) : null
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH, // Square aspect ratio
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  photographerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 4,
  },
  photographerName: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
  },
  loader: {
    padding: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
});
