import React from "react";
import { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage"; //storage featuring
import { API_URL } from "@env";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackbox, setSnackbox] = useState("");
  async function onClickLogin(e) {
    // async function getData(){
    //   console.log
    //   try {
    //     const value = await AsyncStorage.getItem('my');
    //       console.log(value)

    //   } catch (e) {
    //     console.log(e)
    //   }
    // };
    // getData();
    if (email.trim() === "" || password.trim() === "") {
      setSnackbox("FIELD EMPTY");
    } else {
      const message = await fetch(API_URL + "api/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email:email.trim(), password:password.trim() }),
      }).then((e) => e.json()).catch(err =>{});
      if (message.error) {
        setSnackbox(message.message);
      } else {
        setSnackbox(message.message);
        async function setEmail() {
            try {
             AsyncStorage.setItem("isLogged","true");
             AsyncStorage.setItem("email",email.trim());
          } catch (e) {
            console.log(e);
          }
        };
        setEmail();
        navigation.reset({
          index: 0,
          routes: [{ name: "home" }],
        });
      }
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ color: "white", fontSize: 40 }}>{snackbox}</Text>
      </View>
      <View>
        <Image
          source={require("../assets/logo2.png")}
          style={{ width: 150, height: 60 }}
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          placeholder="Email..."
          value={email}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          placeholder="password..."
          value={password}
          placeholderTextColor="#fff"
        />
        <Text  onPress={onClickLogin} style={styles.text_register}>
          LOGIN
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A4041",
    alignItems: "center",
    justifyContent: "center",
  },
  text_register: {
    color: "#1A4041",
    backgroundColor: "#fff",
    paddingHorizontal: 100,
    paddingVertical: 20,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 30,
    marginTop: 50,
  },
  text_login: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 10,
  },
  input: {
    height: 50,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: "white",
    borderColor: "white",
    fontSize: 20,
  },});
