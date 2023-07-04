import * as React from "react";
import {
  NavigationContainer,
  StackActions,
  NavigationAction,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/HomeScreen";
import Landing from "./screens/LandingScreen";
import Login from "./screens/LoginScreen";
import Register from "./screens/RegisterScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="landing"
          component={Landing}
          options={{ title: "welcome" }}
        />
        <Stack.Screen
          name="login"
          component={Login}r
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="home"
          component={Home}
          options={{ title: "AMBULER" }}
        />
        <Stack.Screen
          name="register"
          component={Register}
          options={{ title: "register here" }}
        />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
}
