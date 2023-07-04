import { StatusBar } from "expo-status-bar";
import { Button, Switch, StyleSheet, Text, View, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage"; //storage featuring
import { API_URL } from "@env";

let timeout = () => {};
export default function Home({ navigation }) {
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      foregroundSubscrition = Location.watchPositionAsync(
        {
          // Tracking options
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
        },
        (location) => {
          console.log(location.coords);

          setUserLocation(location.coords);
        }
      );
    })();
  }, []);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () =>
    setIsEnabled((previousState) => {
      setOnline(!previousState);
      return !previousState;
    });
  const [isConfirm, setIsConfirm] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [user,setUser] = useState({number:"number",email:"email",name:"name"});
  const [currentLoc, setLocation] = useState("");
  const [viewPort, setViewPort] = useState({
    latitude: 10.184909,
    longitude: 76.375305,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  async function getEmail() {
    try {
      const value = await AsyncStorage.getItem("email");
      return value;
    } catch (e) {
      console.log(e);
    }
  }
  async function setOnline(value) {
    const email = await getEmail();

    await fetch(API_URL + "api/driver/setActive", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive: value, email }),
    })
      .then((e) => {
        e.json();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function onClickYes(item) {
    const email = await getEmail();
    fetch(API_URL + "api/setCustomer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer: item.email, email }),
    })
      .then((e) => e.json())
      .catch((err) => {});

    setIsConfirm([item]);
    setDrivers([]);
    toggleSwitch();
    fetch(API_URL + "api/setEmergency", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isEmergency: false, email: item.email }),
    })
      .then((e) => e.json())
      .catch((err) => {});

    timeout = setInterval(async function () {
      const email = await getEmail();
      const dats = { email, ...currentLoc };
      const mess = await fetch(API_URL + "api/driver/loc", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(dats),
      })
        .then((e) => e.json())
        .catch((err) => {});
      return () => clearInterval(timeout);
    }, 5000);
  }

  function onReach() {
    console.log("reached succesfully....");
    Alert.alert("Are you There?", "Confirm payment" , [
      {
        text: "YES",
        onPress: async () => {
          console.log("reached succesfully");
          clearInterval(timeout);
          //sent api req to set user emergency to false;
          const email = await getEmail();
          fetch(API_URL + "api/setCustomer", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ customer: "", email }),
          })
            .then((e) => e.json())
            .catch((err) => {});

          setIsConfirm([]);
        },
      },
      { text: "NO", onPress: () => {} },
    ]);
  }

  const [userLocation, setUserLocation] = useState("");
  const [selectDriver, setSelectDriver] = useState("");
  const [confirmUser,setConfirmUser] = useState({});
  const [snackbox, setSnackbox] = useState("");
  useEffect(() => {
    const intervalId = setInterval(async () => {
      //assign interval to a variable to clear it.
      if (!isEnabled) return () => clearInterval(intervalId);
      fetch(API_URL + "api/getEmergency")
        .then((e) => e.json())
        .then((item) => {
          setDrivers(item.driver);
        })
        .catch((err) => {});
      //driverupdate
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isEnabled]);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      //assign interval to a variable to clear it.
      // console.log(currentLoc);
      if (!currentLoc) {
        setSnackbox("Turn on LOCATION");
        return () => clearInterval(intervalId);
      } else setSnackbox("");

      if (!isEnabled) return () => clearInterval(intervalId);
      const email = await getEmail();
      const mess = await fetch(API_URL + "api/driver/loc", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, ...currentLoc }),
      })
        .then((e) => e.json())
        .catch((err) => {});

      //driverupdate
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isEnabled]);

  async function onLogout(e) {
    async () => {
      try {
        AsyncStorage.setItem("isLogged", "false");
      } catch (e) {
        console.log(e);
      }
    };
    setOnline("false");
    const email = await getEmail();
    fetch(API_URL + "api/setCustomer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer: "", email }),
    })
      .then((e) => e.json())
      .catch((err) => {});
    clearInterval(timeout);
    navigation.reset({
      index: 0,
      routes: [{ name: "landing" }],
    });
  }
  return (
    <View style={styles.container}>
      {isConfirm.length === 0 ? (
        <Text></Text>
      ) : (
        <Text
          onPress={onReach}
          style={{ ...styles.text_login, marginLeft: -100 }}
        >
          Are you Reached?
        </Text>
      )}
      {isConfirm.length === 0 ? (
        <Text></Text>
      ) : (
        <Text
          onPress={async()=>{
            Alert.alert("User detail","Name: " + confirmUser?.name + "\nEmail: " + confirmUser?.email + "\nNumber " + confirmUser?.number)}}
          style={{ ...styles.text_login,color:"aqua", marginLeft: -100 }}
        >
          USER DETAIL
        </Text>
      )}
      <View>
        {isConfirm.length !== 0 ? (
          <Text></Text>
        ) : (
          <Switch
            onPress={toggleSwitch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        )}
        <Text onPress={onLogout} style={styles.text_login}>
          LOGOUT
        </Text>
        <Text style={{ color: "white", fontSize: 30 }}>{snackbox}</Text>
      </View>
      <View>
        <MapView
          // initialRegion={currentLoc}
          region={viewPort}
          onRegionChange={(re) => {
            setLocation(re);
          }}
          showsUserLocation={true}
          style={{ width: 360, height: 400 }}
          onUserLocationChange={(r) => {
            setUserLocation(r.nativeEvent.coordinate);
          }}
        >
          {drivers.map((item, i) => (
            <Marker
              onPress={() => {
                setConfirmUser(item)
                setSelectDriver(item._id);
                Alert.alert("Confirm", "Are you Taking the trip?", [
                  {
                    text: "YES",
                    onPress: () => {
                      onClickYes(item);
                    },
                  },
                  { text: "NO" },
                ]);
              }}
              key={item._id}
              image={require("../assets/test.jpg")}
              style={{ width: 4, height: 4 }}
              resizeMode="contain"
              coordinate={{ latitude: item.lat, longitude: item.lng }}
            />
          ))}
          {isConfirm.map((item, i) => (
            <Marker
              onPress={()=>{}}
              key={item._id}
              image={require("../assets/test.jpg")}
              style={{ width: 4, height: 4 }}
              resizeMode="contain"
              coordinate={{ latitude: item.lat, longitude: item.lng }}
            />
          ))}
        </MapView>
        <Text style={styles.text_register}>
          {isEnabled ? "ONLINE" : "OFFLINE"}
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
    color: "#F14135",
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
    fontSize: 18,
    marginTop: 10,
    marginLeft: 240,
  },
});
