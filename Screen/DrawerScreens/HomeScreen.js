// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React, { useEffect, useState } from 'react';
import {
  View, Text, SafeAreaView,
  StyleSheet,
  ScrollView, Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { height, width: SCREEN_WIDTH } = Dimensions.get("window");
const HomeScreen = () => {
  const [foods, setFoods] = useState([]);
  const [user, setUser] = useState("Loading...");
  const [ok, setOk] = useState(false);
  const [error, setErrortext] = useState("");
  const getUserInfo = async () => {
    AsyncStorage.getItem('user_id').then((value) => {
      if (value) {
        setOk(true);
        setUser(value);
        if (ok)
          console.log(value, ok);
      }
      else {
        setOk(false);
      }
    });
  }
  const getUserItems = async () => {
    fetch('http://' + config.serverIp + '/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        'userEmail': user
      }),
      headers: {
        //Header Defination
        Accept: 'application/json, text/plain,',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        //setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          setFoods(responseJson.data);
        } else {
          setErrortext(responseJson.msg);
          console.log('no data');
        }
      })
      .catch((error) => {
        //Hide Loader
        //setLoading(false);
        console.error(error);
      });
  }
  const deleteUserItems = (id) => {
    fetch('http://' + config.serverIp + '/api/user/login', {
      method: 'POST',
      body: JSON.stringify({
        'userEmail': user,
        'id': id
      }),
      headers: {
        //Header Defination
        Accept: 'application/json, text/plain,',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        //Hide Loader
        //setLoading(false);
        console.log(responseJson);
        // If server response message same as Data Matched
        if (responseJson.status === 'success') {
          setFoods(responseJson.data);
        } else {
          setErrortext(responseJson.msg);
          console.log('no data');
        }
      })
      .catch((error) => {
        //Hide Loader
        //setLoading(false);
        console.error(error);
      });
  }
  useEffect(() => {
    getUserInfo();
    //console.log(ok);

  }, []);
  useEffect(() => {
    getUserItems();
  }, [user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            {user}
            {'\n\n'}

          </Text>
        </View>
        {/* <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: 'grey',
          }}>
          {JSON.stringify(foods)}
        </Text> */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          indicatorStyle="white"
          contentContainerStyle={styles.weather}
        >
          {
            foods.map((food, index) => {
              return (
                <View key={index} style={styles.food}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <Text style={styles.foodName}>{food.foodName}</Text>
                  </View>
                  <Text style={styles.desc}>{"quantity : " + food.foodQuantity}</Text>
                  <Text style={styles.date}>{food.expiry_date}</Text>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => { deleteUserItems(food.id) }}>
                    <Text style={styles.buttonTextStyle}>delete</Text>
                  </TouchableOpacity>
                </View>)
            }
            )
          }
        </ScrollView>
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: 'grey',
          }}
          onPress={() => getUserItems()}>
          good? reload?
        </Text>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "darkseagreen",
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  city: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",

  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  weather: {

  },
  food: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,

  },
  foodName: {
    color: "black",
    fontSize: 100,
    fontWeight: "600",
    paddingBottom: 25,
  },
  desc: {
    marginTop: -20,
    fontSize: 30,
    paddingLeft: 10,
    color: "grey",
  },
  date: {
    fontSize: 25,
    color: "grey",
    paddingLeft: 10,
    marginBottom: -15
  },
  icon: {
    fontSize: 58,
    color: "white",
  },

})

export default HomeScreen;