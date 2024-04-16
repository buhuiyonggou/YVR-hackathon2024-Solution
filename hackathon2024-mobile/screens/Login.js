import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/firebase-setup";
import PressableButton from "../components/PressableButton";
import ColorsHelper from "../components/ColorsHelper";

const screenWidth = Dimensions.get("window").width;
const fontSizeBasedOnScreen = screenWidth * 0.07;

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupHandler = () => {
    navigation.replace("Signup");
  };
  const loginHandler = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter a password.");
      return;
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      // const user = userCred.user;
      // await updateUser(user.uid, { offline: false });
    } catch (err) {
      Alert.alert("Error", "Invalid email or password.");
      console.log("login ", err);
      setEmail("");
      setPassword("");
    }
  };

  return (

      <View style={styles.container}>
        <View style={styles.welcomeContainer}>
        <ImageBackground
          source={require('../assets/PATTISON_YVR_banner.png')} 
          style={styles.imageBackground}
          resizeMode="cover" 
        >
          <View style={styles.bottomTextView}>
          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.welcome}>YVR OpsAlert</Text>
          </View>
        </ImageBackground>
        </View>
        <ScrollView>
        <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={(newText) => setEmail(newText)}
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          value={password}
          onChangeText={(newText) => setPassword(newText)}
          autoCapitalize="none"
        />
        <View style={styles.buttonContainer}>
          <PressableButton
            pressableFunction={loginHandler}
            defaultStyle={styles.linkButton}
            pressedStyle={{
              backgroundColor: ColorsHelper.buttonPressed,
              opacity: 0.5,
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </PressableButton>

          <PressableButton
            pressableFunction={signupHandler}
            defaultStyle={styles.linkButton}
            pressedStyle={{
              backgroundColor: ColorsHelper.buttonPressed,
              opacity: 0.5,
            }}
          >
            <Text style={styles.buttonText}>New User? Create An Account </Text>
          </PressableButton>
        </View>
      </View>
      </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorsHelper.white,
    alignItems: "stretch",
    justifyContent: "center",
    marginBottom: 25
  },
  input: {
    borderColor: ColorsHelper.headers,
    borderWidth: 2,
    borderRadius: 5,
    width: "80%",
    height: "15%",
    marginBottom: 20,
    marginLeft: "10%",
    margin: 5,
    padding: 5,
  },
  label: {
    marginLeft: "10%",
    fontSize: 20,
  },
  welcomeContainer: {
    marginBottom: "10%",
    borderColor: ColorsHelper.headers,
    height: "35%",
    borderWidth: 2,
    borderRadius: 5,
    overflow: 'hidden', // Ensure the background image does not leak outside the border radius
  },
  welcome: {
    fontSize: fontSizeBasedOnScreen,
    fontWeight: "bold",
    color: ColorsHelper.white,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkButton: {
    backgroundColor: ColorsHelper.transparent,
    width: screenWidth * 0.9,
  },
  buttonText: {
    fontSize: 20,
    color: ColorsHelper.headers,
    fontWeight: "bold",
  },
  imageBackground: {
    width: '100%', 
    height: '100%', 
    justifyContent: 'flex-end',
  },
  bottomTextView: {
    paddingBottom: 5 
  },
});
