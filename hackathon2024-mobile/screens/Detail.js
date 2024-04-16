import {
  AntDesign,
  Ionicons,
  Fontisto,
  Entypo,
} from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import ColorsHelper from "../components/ColorsHelper";
import ImageCarousel from "../components/ImageCarousel";
import PressableButton from "../components/PressableButton";
import { NotificationLevel } from "../components/NotificationLevel";
import { getAuth } from "firebase/auth";
import { updateReview } from "../Firebase/firestoreHelper";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../Firebase/firebase-setup";

export default function Detail({ route }) {
  const { review, imageUris } = route.params;
  const [canModify, setCanModify] = useState(false);
  const navigation = useNavigation();
  
  const getColorForLevel = () => {
    const colorLevel = review.level;
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
  
  useEffect(() => {
    const checkIfUserCanModify = async () => {
      const user = auth.currentUser;
      const userId = user ? user.uid : null;
      console.log("currentUserId", userId, "review.claimBy", review.claimBy);
      if (!userId) {
        console.error("No user is logged in");
        navigation.navigate("Login");
      } else {
        console.log("currentUserId", userId, "review.claimBy", review.claimBy);
        // review.claimBy is null also allow user to claim
        if (review.claimBy === userId || review.claimBy === "" || review.claimBy === null) {
          setCanModify(true);
        }
      }
    };

    checkIfUserCanModify();
  }, [navigation, review.claimBy]);

  const handleStatusChange = async (newStatus) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user ? user.uid : null;
    console.log("review", review);
    let updatedReview = {
      status: newStatus,
    };

    // If the new status is "In Progress", include the user ID who claimed it
    if (newStatus === "In Progress" && userId) {
      updatedReview = { ...updatedReview, claimBy: userId };
    }

    try {
      await updateReview(review.id, updatedReview);
      // Optionally navigate to a different screen after successful update
      if (newStatus === "In Progress") {
        navigation.navigate("In Progress");
      } else if (newStatus === "Archived") {
        navigation.navigate("Archived");
      }
    } catch (error) {
      console.error("Error updating review: ", error);
      Alert.alert("Error", "Failed to update status");
    }
  };

  return (
    <ScrollView>
      <View style={styles.exploreContainer}>
        <ImageCarousel imageUris={imageUris} />

        <View style={styles.infoContainer}>
          <View style={styles.singleDisplay}>
            <AntDesign style={[styles.icon, { color: getColorForLevel() }]} name="exclamationcircle" size={18} />
            <Text style={styles.text}>
              {" "}
              {NotificationLevel[review.level]}
            </Text>
          </View>

          <View style={styles.singleDisplay}>
            <AntDesign style={styles.icon} name="tag" size={18} />
            <Text style={styles.text}> Type: {review.issueType}</Text>
          </View>

          <View style={styles.singleDisplay}>
            <Ionicons
              style={styles.icon}
              name="home"
              size={18}
            />
            <Text style={styles.text}> Location: {review.area}</Text>
          </View>

          <View style={styles.singleDisplay}>
            <Fontisto style={styles.icon} name="flash" size={18} />
            <Text style={styles.text}> Status: {review.status}</Text>
          </View>

          <View style={styles.singleDisplay}>
            <Entypo style={styles.icon} name="man" size={18} />
            <Text style={styles.text}>Assigned to: {review.claimBy}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {canModify && (
          <>
            <PressableButton
              pressableFunction={() => {
                handleStatusChange("In Progress");
                navigation.navigate("In Progress");
              }}
              enabled={canModify}
            >
              <Text style={styles.buttonText}>Assign</Text>
            </PressableButton>
            <PressableButton
              pressableFunction={() => {
                handleStatusChange("Archived");
                navigation.navigate("Archived");
              }}
              enabled={canModify}
            >
              <Text style={styles.buttonText}>Archive</Text>
            </PressableButton>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  exploreContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  imageContainer: {
    width: 320,
    height: 130,
    marginTop: 5,
    justifyContent: "center",
  },
  image: {
    width: 110,
    height: 110,
    resizeMode: "cover",
    alignSelf: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  infoDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
  },
  singleDisplay: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    marginBottom: 5,
  },
  displayItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    width: "45%",
  },
  icon: {
    marginRight: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
    marginBottom: 20,
    height: 30,
  },
  buttonText: {
    fontSize: 14,
    color: ColorsHelper.white,
  },
  locationDisplay: {
    alignItems: "center",
    margin: 10,
    marginTop: 10,
    height: 320,
  },
  map: {
    width: "90%",
  },
  commentContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  commentText: {
    // fontWeight: "bold",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 6,
    marginLeft: 10,
    marginRight: 15,
    color: ColorsHelper.headers,
  },
  commentInput: {
    height: 80,
    borderColor: ColorsHelper.gray,
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    padding: 10,
    paddingLeft: 10,
    maxWidth: "100%",
    textAlign: "left",
  },
  commentRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 15,
  },
  dropdownRating: {
    margin: 5,
    height: 40,
    borderRadius: 5,
    borderBottomColor: ColorsHelper.gray,
    borderBottomWidth: 0.8,
    width: "75%",
  },
  placeholderStyle: {
    color: ColorsHelper.gray,
    textAlign: "center",
  },
  commentDisplay: {
    marginTop: 20,
    padding: 15,
  },
  commentHeader: {
    marginBottom: 15,
    marginTop: 30,
  },
});
