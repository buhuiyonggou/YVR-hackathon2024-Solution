import React, { useEffect, useState, useRef } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { database } from "./Firebase/firebase-setup";
import { auth } from "./Firebase/firebase-setup";
import { Entypo, AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import PressableButton from "./components/PressableButton";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Explore from "./screens/Explore";
import Claimed from "./screens/Claimed";
import Archived from "./screens/Archived";
import Me from "./screens/Me";
import Detail from "./screens/Detail";
import * as Notifications from "expo-notifications";
import { newAlertNotification } from "./components/PushNotificationManager";
import ColorsHelper from "./components/ColorsHelper";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const exploreIcon = require('./assets/explore.png');

export default function App() {
  const [isUserLoggedin, setIsUserLoggedIn] = useState(false);
  const responseListener = useRef();
  const notificationListener = useRef();
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("notification listener ", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (navigationRef.current) {
          navigationRef.current.navigate("MainTabs", { screen: "Post" });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    let isInitialSnapshot = true; 
  
    const unsubscribe = onSnapshot(collection(database, "notifications"), (snapshot) => {
      if (!isInitialSnapshot) {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const notificationData = change.doc.data();
            newAlertNotification(notificationData);
          }
        });
      } else {
        isInitialSnapshot = false;
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });
  }, []);

  const AuthStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: ColorsHelper.headers },
        headerTintColor: ColorsHelper.tintColor,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );

  const MainTabs = () => (
    <Tab.Navigator
      initialRouteName="Explore"
      screenOptions={() => ({
        headerStyle: { backgroundColor: ColorsHelper.headers },
        headerTintColor: ColorsHelper.tintColor,
        headerTitleAlign: "center",

        tabBarActiveTintColor: ColorsHelper.activeTintColor,
        tabBarInactiveTintColor: ColorsHelper.inactiveTintColor,
        tabBarStyle: { backgroundColor: ColorsHelper.headers },
        tabBarLabelStyle: { fontSize: 14 },

        headerRight: () => {
          return (
            <PressableButton
              pressableFunction={async () => {
                signOut(auth);
              }}
              defaultStyle={{ backgroundColor: ColorsHelper.headerRight }}
            >
              <AntDesign name="logout" size={24} />
            </PressableButton>
          );
        },
      })}
    >
      <Tab.Screen
        name="Notifications"
        component={Explore}
        options={{
          headerTitle: "Notifications&Alerts",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="In Progress"
        component={Claimed}
        options={{
          headerTitle: "Notifications In Progress",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="heart-outlined" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Archived"
        component={Archived}
        options={{
          headerTitle: "Notifications Archived",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="heart-outlined" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={Me}
        options={{
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );

  const MainStack = () => (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: ColorsHelper.headers },
        headerTintColor: ColorsHelper.tintColor,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer ref={navigationRef}>
      {isUserLoggedin ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
