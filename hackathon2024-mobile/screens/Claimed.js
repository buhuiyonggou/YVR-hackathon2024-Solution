import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ImageBackground,
} from "react-native";
import ReviewItem from "../components/ReviewItem";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "../Firebase/firebase-setup";
import ColorsHelper from "../components/ColorsHelper";

export default function Claimed({ navigation }) {
  const [notifications, SetNofitications] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(database, "notifications"),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          let newNotifications = querySnapshot.docs
            .map((item) => {
              return { ...item.data(), id: item.id };
            })
            .filter((item) => item.status === "In Progress")
            .sort((a, b) => {
              // Sort by numeric level directly
              const levelComparison = a.level - b.level;
              if (levelComparison !== 0) {
                return levelComparison;
              }
              // Assuming createdAt is a timestamp. Adjust if it's a different format.
              const aCreatedAt = a.createdAt.toMillis
                ? a.createdAt.toMillis()
                : a.createdAt;
              const bCreatedAt = b.createdAt.toMillis
                ? b.createdAt.toMillis()
                : b.createdAt;
              return bCreatedAt - aCreatedAt; // Show newer notifications first
            });

          SetNofitications(newNotifications);
        } else {
          SetNofitications([]);
        }
      }
    );
    return () => {
      unsubscribe();
    };
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
      <FlatList
        contentContainerStyle={styles.scrollViewContent}
        data={notifications}
        renderItem={({ item }) => (
          <ImageBackground
            source={require("../assets/claimed.png")}
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
  image: {
    width: "100%",
    height: "100%",
    // at least take 100% of the screen
    resizeMode: "cover",
  },
  scrollViewContent: {
    alignItems: "center",
  },
  introduction: {
    width: "95%",
    margin: 11,
    alignSelf: "center",
    marginBottom: 15,
  },
  introText: {
    fontSize: 15,
    margin: 5,
    color: "#191970",
    fontWeight: "bold",
  },
});
