// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/
//expo-camera ref 
//https://github.com/hayanisaid/expo-camera-tutorial/blob/master/App.tsx 

// Import React and Component
import React, { useEffect, useState } from 'react';
import {
    View, Text, SafeAreaView,
    StyleSheet, Image, ImageBackground,
    ScrollView, Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Keyboard,
    KeyboardAvoidingView,
    TextInput,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Components/Loader';
import { Camera } from 'expo-camera';
import dateFormat, { masks } from "dateformat";


const { height, width: SCREEN_WIDTH } = Dimensions.get("window");
const addingFoodScreen = ({ navigation }) => {
    const [foodName, setFoodName] = useState();
    const [expiryDate, setExpiryDate] = useState();
    const [foodQuantity, setFoodQuantity] = useState();
    const [user, setUser] = useState("Loading...");
    const [loading, setLoading] = useState(false);
    const [ok, setOk] = useState(false);
    const [errortext, setErrortext] = useState('');
    const [startCamera,setStartCamera] = useState(false)
    const [camera,setCamera] = useState(null)
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const [capturedImage, setCapturedImage] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [blob, setBlob] = useState();


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

    const handleSubmitPress = () => {
        setErrortext('');
        if (!foodName) {
            alert('Please fill food name');
            return;
        }
        if (!expiryDate) {
            alert('Please fill expiryDate');
            return;
        }
        if (!foodQuantity) {
            alert('Please fill expiryDate');
            return;
        }
        setLoading(true);
        // let dataToSend = {email: userEmail, password: userPassword};
        // let formBody = [];
        // for (let key in dataToSend) {
        //   let encodedKey = encodeURIComponent(key);
        //   let encodedValue = encodeURIComponent(dataToSend[key]);
        //   formBody.push(encodedKey + '=' + encodedValue);
        // }
        // formBody = formBody.join('&');

        fetch('http://' + config.serverIp + '/api/user/login', {
            method: 'POST',
            body: JSON.stringify({
                'userEmail': user,
                'foodName': foodName,
                'expiryDate': expiryDate,
                'foodQuantity': foodQuantity
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
                setLoading(false);
                console.log(responseJson);
                // If server response message same as Data Matched
                if (responseJson.status === 'success') {
                    Alert.alert(
                        'Adding Food',
                        'Successfully added food!',
                        [
                          {
                            text: 'oh yeah!',
                            onPress: () => {
                              return null;
                            },
                          },
                        ],
                        {cancelable: false},
                      );
                    console.log("Successfully added food!");
                    //navigation.replace('DrawerNavigatorRoutes');
                } else {
                    setErrortext(responseJson.msg);
                    console.log('Please check your food info...');
                }
            })
            .catch((error) => {
                //Hide Loader
                setLoading(false);
                console.error(error);
            });
    };
    const predictFood =async()=>{
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
        //const galleryStatus = await ImagePicker.requestCameraRollPermissionAsync();
        //setHasGalleryPermission(galleryStatus.status === "granted")

        if(hasCameraPermission){
            setStartCamera(true)
        }
        else{
            // Alert.alert(
            //     "camera access",
            //     "Camera Access DENIED",
            //     [
            //         {
            //         text: 'oh my god!',
            //         onPress: () => {
            //             return null;
            //         },
            //         },
            //     ],
            //     {cancelable: false},
            // )
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        }
    }
    const takePicture = async () => {
        const photo = await camera.takePictureAsync()
        console.log(photo)
        setPreviewVisible(true)
        
        //save captured photo to state
        setCapturedImage(photo)
        
    }
    const retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        setStartCamera(true)
    }
    const savePhoto = () => {
        setStartCamera(false)
        predictPicture();
    }

    const predictPicture = () =>{
        const current = new Date();
        fetch((capturedImage.uri).replace("file:///","file:/")).then((res)=>{setBlob(res.blob())});
        console.log("blob is : ",blob);
        //const blob =  response.blob;
        

        setLoading(true);
        let formData = new FormData();
        formData.append("file", blob);

        fetch('http://' + config.serverIp + '/api/user/login', {
            method: 'POST',
            body: formData,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            //Hide Loader
            setLoading(false);
            console.log(responseJson);
            // If server response message same as Data Matched
            setFoodName(responseJson.className);

            // it adds days to a current date
            current.setDate(current.getDate()+responseJson.extraDate);
            currentStr = dateFormat(current,"yyyy-mm-dd")
            setExpiryDate(currentStr);
            
        })
        .catch((error) => {
            //Hide Loader
            setLoading(false);
            console.error(error);
        });
    }

    useEffect(() => {
        getUserInfo();
        //console.log(ok);

    }, []);


    return (
        startCamera ? 
        (
            <View
              style={{
                flex: 1,
                width: '100%'
              }}
            >
            {previewVisible && capturedImage ? (
                <CameraPreview photo={capturedImage} savePhoto={savePhoto} retakePicture={retakePicture} />
            ) : (
            
            <Camera
                type={cameraType}
                style={{flex: 1}}
                ref={(ref)=> setCamera(ref)}
            >
                <View
                style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: 'transparent',
                    flexDirection: 'row'
                }}
                >
                <View
                    style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                    }}
                >
                </View>
                <View
                    style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'space-between'
                    }}
                >
                    <View
                    style={{
                        alignSelf: 'center',
                        flex: 1,
                        alignItems: 'center'
                    }}
                    >
                    <TouchableOpacity
                        onPress={takePicture}
                        style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        borderRadius: 50,
                        backgroundColor: '#fff'
                        }}
                    />
                    </View>
                </View>
                </View>
            </Camera>
            )}
            
            </View>
          ) :
        <View style={styles.mainBody}>
            <Loader loading={loading} />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    flex: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <View>
                    <KeyboardAvoidingView enabled>
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../../src/maxresdefault.jpg')}
                                style={{
                                    width: '50%',
                                    height: 100,
                                    resizeMode: 'contain',
                                    margin: 30,
                                }}
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                value={foodName}
                                onChangeText={(foodName) =>
                                    setFoodName(foodName)
                                }
                                placeholder="Enter the name of the food" 
                                placeholderTextColor="#8b9cb5"
                                autoCapitalize="none"
                                keyboardType="default"
                                returnKeyType="next"
                                onSubmitEditing={() => { }
                                }
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                            />
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={0.5}
                                onPress={predictFood}>
                                <Text style={styles.buttonTextStyle}>Predict Food</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                value={expiryDate}
                                onChangeText={(expiry_date) =>
                                    setExpiryDate(expiry_date)
                                }
                                placeholder="Enter expiry date" 
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                //ref={passwordInputRef}
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                                underlineColorAndroid="#f000"
                                returnKeyType="next"
                            />
                        </View>
                        <View style={styles.SectionStyle}>
                            <TextInput
                                style={styles.inputStyle}
                                onChangeText={(foodQuantity) =>
                                    setFoodQuantity(foodQuantity)
                                }
                                placeholder="Enter food quantity" 
                                placeholderTextColor="#8b9cb5"
                                keyboardType="default"
                                //ref={passwordInputRef}
                                onSubmitEditing={Keyboard.dismiss}
                                blurOnSubmit={false}
                                //secureTextEntry={true}
                                underlineColorAndroid="#f000"
                                returnKeyType="next"
                            />
                        </View>
                        {errortext != '' ? (
                            <Text style={styles.errorTextStyle}>
                                {errortext}
                            </Text>
                        ) : null}
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={0.5}
                            onPress={handleSubmitPress}>
                            <Text style={styles.buttonTextStyle}>ADD</Text>
                        </TouchableOpacity>
                        <Text
                            style={styles.registerTextStyle}
                            onPress={() => navigation.navigate('HomeScreen')}>
                            go back to home
                        </Text>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#307ecc',
        alignContent: 'center',
    },
    SectionStyle: {
        flexDirection: 'row',
        height: 40,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
        margin: 10,
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
    inputStyle: {
        flex: 1,
        color: 'white',
        paddingLeft: 15,
        paddingRight: 15,
        borderWidth: 1,
        borderRadius: 30,
        borderColor: '#dadae8',
    },
    registerTextStyle: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 14,
        alignSelf: 'center',
        padding: 10,
    },
    errorTextStyle: {
        color: 'red',
        textAlign: 'center',
        fontSize: 14,
    },
});

const CameraPreview = ({photo, retakePicture, savePhoto}) => {
    console.log('photo', photo)
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <ImageBackground
          source={{uri: photo && photo.uri}}
          style={{
            flex: 1
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              padding: 15,
              justifyContent: 'flex-end'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity
                onPress={retakePicture}
                style={{
                  width: 130,
                  height: 40,
  
                  alignItems: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  Re-take
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={savePhoto}
                style={{
                  width: 130,
                  height: 40,
  
                  alignItems: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  use photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    )
  }
  


export default addingFoodScreen;
