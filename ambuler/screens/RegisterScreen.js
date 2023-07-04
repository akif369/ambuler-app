import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput } from "react-native";
import { API_URL } from "@env";
export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [snackbox, setSnackbox] = useState("");
  async function onClickLogin(e) {
    if (
      email.trim() === "" ||
      password.trim() === "" ||
      name.trim() === "" ||
      number.trim() === ""
    ) {
      setSnackbox("FIELD EMPTY");
    } else {
      
      const message = await fetch(API_URL + "api/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          name: name.trim(),
          number: number.trim(),
        }),
      })
        .then(async (response) => {
          console.log(response.ok)
          // if (!response.ok) {
          //   if(response.status === 401)
          //   throw new Error(response.json().message);
          //   throw new Error("Network is very bad");
          // }
          // console.log(response.json())
          return response.json();
        })
        .catch((error) => {
          console.log(
            "there is problem with it= " + error
          );
          return {error:true,message:error.message}
        });

      if (message.error) {
        setSnackbox(message.message);
      } else {
        setSnackbox(message.message);
        navigation.navigate("login");
      }
    }
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={{ color: "white", fontSize: 30 }}>{snackbox}</Text>
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
          onChangeText={setName}
          placeholder="Name..."
          value={name}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          onChangeText={setNumber}
          placeholder="Number..."
          value={number}
          placeholderTextColor="#fff"
        />
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

        <Text onPress={onClickLogin} style={styles.text_register}>
          REGISTER
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
  },
});
