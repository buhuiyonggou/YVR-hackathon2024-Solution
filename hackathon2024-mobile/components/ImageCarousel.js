import React from "react";
import { FlatList, Image, StyleSheet } from "react-native";

function ImageCarousel({ imageUris }) {
  return (
    <FlatList
      data={imageUris}
      renderItem={({ item: uri }) => (
        <Image
          source={{ uri }}
          style={styles.image}
          onError={(e) => {
            console.error("Error loading image: ", e.nativeEvent.error);
          }}
        />
      )}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.imageContainer}
    />
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 400,
    height: 400,
    marginTop: 5,
    // justifyContent: "left",
    justifyContent: "center",
    gap: "15px"
  },
  image: {
    width: 370,
    height: 280,
    resizeMode: "cover",
    alignSelf: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
});

export default ImageCarousel;
