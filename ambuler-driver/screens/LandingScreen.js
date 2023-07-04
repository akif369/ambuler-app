import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.jpg")} style={{width:380,height:300}} />
      <Text onPress={()=>{navigation.navigate("register")}} style={styles.text_register}>Register</Text>
      <Text onPress={()=>{navigation.navigate("login")}} style={styles.text_login}>Log in</Text>
      

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A4041',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_register:{
    color:"#1A4041",
    backgroundColor:"#fff",
    paddingHorizontal:100,
    paddingVertical:20,
    borderRadius:5,
    fontWeight:'bold',
    fontSize:30,
    marginTop:50,
  },
  text_login:{
    color:"#fff",fontWeight:'bold',fontSize:28,marginTop:10
  }
});
