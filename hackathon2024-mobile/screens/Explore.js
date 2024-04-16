import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import ReviewItem from "../components/ReviewItem";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../Firebase/firebase-setup";
import ColorsHelper from "../components/ColorsHelper";

export default function Explore({ navigation }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, "notifications"),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          let newReviews = querySnapshot.docs
            .map((doc) => ({ ...doc.data(), id: doc.id }))
            .filter(
              (item) =>
                item.status !== "In Progress" && item.status !== "Archived"
            )
            .sort((a, b) => {
              if (a.level !== b.level) {
                return a.level - b.level;
              }
              return b.createdAt - a.createdAt;
            });
          setReviews(newReviews);
        } else {
          setReviews([]);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const reviewPressedToDetail = (review) => {
    navigation.navigate("Detail", {
      review: review,
    });
  };

  return (
    <View style={styles.reviewsContainer}>
      <View style={styles.introduction}>
        <Text style={styles.introText}>
          Scroll the page to see all pending notifications
        </Text>
        <Text style={styles.introText}>Click button to review details</Text>
      </View>

      {reviews && (
        <>
          <FlatList
            contentContainerStyle={styles.scrollViewContent}
            data={reviews}
            renderItem={({ item }) => (
              <ImageBackground
                source={require("../assets/explore.png")}
                resizeMode="cover"
              >
                <ReviewItem
                  reviewData={item}
                  pressFunction={() => reviewPressedToDetail(item)}
                  navigation={navigation}
                />
              </ImageBackground>
            )}
          />
          <StatusBar style="auto" />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  reviewsContainer: {
    flex: 1,
    // backgroundColor: ColorsHelper.cardBackGround2,
    backgroundColor: ColorsHelper.white,
    marginBottom: 50,
  },

  scrollViewContent: {
    alignItems: "center",
    bacjgroundColor: ColorsHelper.white,
  },
  introduction: {
    width: "95%",
    margin: 11,
    alignSelf: "center",
    // marginBottom: 15,
  },
  introText: {
    fontSize: 15,
    margin: 5,
    color: "#191970",
    fontWeight: "bold",
  },
});
