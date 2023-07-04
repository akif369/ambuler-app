import { StatusBar } from "expo-status-bar";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { API_URL } from "@env";
import { useEffect, useState } from "react";
// import GetLocation from 'react-native-get-location'
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage"; //storage featuring
import { isEnabled } from "react-native/Libraries/Performance/Systrace";

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
  const [isConfirm, setIsConfirm] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [currentLoc, setLocation] = useState("");
  const [viewPort, setViewPort] = useState({
    latitude: 10.184909,
    longitude: 76.375305,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState("");
  const [selectDriver, setSelectDriver] = useState("");
  const [enable,setEnable] = useState(false);
  const [snackbox, setSnackbox] = useState("");
  useEffect(() => {
    const intervalId = setInterval(() => {
      if(!enable){
      fetch(API_URL + "api/driver")
        .then((e) => e.json())
        .then((item) => {
          setDrivers(item.driver);
        })
        .catch((err) => {});
      
        
          return () => clearInterval(intervalId);
      }
    }, 5000);
  
  }, []);
  useEffect(() => {
   
  
    const intervalId = setInterval(async() => {
      const email = await getEmail()
      
      fetch(API_URL + "api/findme?email="+email)
        .then((e) => e.json())
        .then((item) => {
          if(item !== null)
            setIsConfirm(JSON.parse(item));
          console.log(item)
        })
        .catch((err) => {});
    }, 5000);

    return () => clearInterval(intervalId);
  

  }, []);

  

  async function onLogout(e) {
    async () => {
      try {
        AsyncStorage.setItem("isLogged", "false");
      } catch (e) {
        console.log(e);
      }
    };
    onClickEmergency(false)
    navigation.reset({
      index: 0,
      routes: [{ name: "landing" }],
    });
  }

  async function onConfirm(){
    console.log(userLocation)
    const email = await getEmail();
    const message = await fetch(API_URL + "api/loc", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        latitude:userLocation.latitude,
        longitude:userLocation.longitude,
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
    }
  }

  async function getEmail() {
    try {
      const value = await AsyncStorage.getItem("email");
      return value;
    } catch (e) {
      console.log(e);
    }
  }
  async function onClickEmergency(value) {
   
    const email = await getEmail();
    const mess = await fetch(API_URL + "api/setEmergency", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ isEmergency: value, email }),
    })
      .then((e) =>{if(value)onConfirm();return e.json()})
      .catch((err) => {});
  }

  return (
    <View style={styles.container}>
      <View>
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
              key={item._id}
              image={require("../assets/vehicle1.jpg")}
              style={{ width: 4, height: 4 }}
              resizeMode="contain"
              coordinate={{ latitude: item.lat, longitude: item.lng }}
            />
          ))}
          {isConfirm.map((item, i) => (
            <Marker
              key={item._id}
              image={require("../assets/vehicle1.jpg")}
              style={{ width: 4, height: 4 }}
              resizeMode="contain"
              coordinate={{ latitude: item.lat, longitude: item.lng }}
            />
          ))}
        </MapView>
        <Text onPress={()=>{ Alert.alert("Are you sure?","Book a trip",[{text:"YES", onPress:()=>{onClickEmergency(true)}},{text:"NO"}]);}} style={styles.text_register}>
          Emergency
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
    fontSize: 28,
    marginTop: 10,
  },
});
