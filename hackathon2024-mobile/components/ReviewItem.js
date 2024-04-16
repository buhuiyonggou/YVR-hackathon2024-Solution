import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "react-native";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { downloadImages } from "./DownLoadImages";
import PressableButton from "./PressableButton";
import { NotificationLevel } from "./NotificationLevel";
import ColorsHelper from "./ColorsHelper";

export default function ReviewItem({ reviewData, navigation }) {
  const [images, setImages] = useState([]);
  // if level == 1, color = ColorsHelper.level1, and so on
  // map color level
  const getColorForLevel = () => {
    const colorLevel = reviewData.level;
    switch (colorLevel) {
      case 1:
        return "red";
      case 2:
        return "orange";
      case 3:
        return "blue";
      case 4:
        return "teal";
      default:
        return "grey";
    }
  };

  const reviewPressedToDetail = (review) => {
    navigation.navigate("Detail", {
      review: review,
      imageUris: images,
    });
    // console.log("test review info in ReviewItem:", review);
  };

  useEffect(() => {
    async function fetchImages() {
      const downloadedImages = await downloadImages(reviewData);
      setImages(downloadedImages);
    }
    // console.log("reviewData in ReviewItem:", reviewData);

    fetchImages();
  }, [reviewData]);

  return (
    <View style={styles.exploreContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: images[0] }}
          style={styles.image}
          onError={(e) => {
            console.error("Error loading image: ", e.nativeEvent.error);
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoDisplay}>
          <AntDesign
            name="exclamationcircle"
            size={18}
            style={{ color: getColorForLevel() }}
          />
          <Text style={[styles.text, { color: getColorForLevel() }]}>
            {" "}
            {NotificationLevel[reviewData.level]}
          </Text>
        </View>

        <View style={styles.infoDisplay}>
          <MaterialIcons name="star-rate" size={18} />
          <Text style={styles.text}> Level: {reviewData.level}</Text>
        </View>

        <View style={[styles.infoDisplay, styles.level]}>
          <AntDesign name="tag" size={18} />
          <Text style={styles.text}> Type: {reviewData.issueType}</Text>
        </View>

        <View style={styles.infoDisplay}>
          <Ionicons style={styles.icon} name="home" size={18} />
          <Text style={styles.text}>Location: {reviewData.area}</Text>
        </View>
        
        <View style={styles.pressableContainer}>
        <PressableButton
          pressableFunction={() => reviewPressedToDetail(reviewData, images)}
          pressedStyle={{
            backgroundColor: ColorsHelper.buttonPressed,
            opacity: 0.5,
          }}
        >
          <Text style={styles.buttonText}>Details</Text>
        </PressableButton>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  exploreContainer: {
    padding: 20,
    alignItems: "center",
    borderWidth: 3,
    borderColor: ColorsHelper.lightgrey2,
    borderRadius: 5,
    width: 330,
    marginBottom: 30,
    backgroundColor: 'rgba(240, 255, 255, 0.7)',
  },
  imageContainer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoContainer: {
    width: "100%",
    gap: 12,
  },
  infoDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  pressableContainer:{
    width: 100,
    alignSelf: "center",
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 15,
    color: ColorsHelper.white,
  },
});
