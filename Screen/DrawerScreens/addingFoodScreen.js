//design ref from https://aboutreact.com/react-native-login-and-signup/
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
import * as FileSystem from 'expo-file-system';
import {config} from '../../secret'
import { set } from 'react-native-reanimated';


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
    const [imageBase64, setImageBase64] = useState("");
    const [previewVisible, setPreviewVisible] = useState(false);
    const [isPredcit, setIsPredict] = useState(false);
    const [isOCR, setIsOCR] = useState(false);
    const [read, setRead] = useState("");


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

        fetch('http://' + config.serverIp + '/api/user/list/add', {
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
    const readyCamera= async()=>{
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
    const predictFood =()=>{
        setIsPredict(true);
        readyCamera();
    }
    const takePicture = async () => {
        const photo = await camera.takePictureAsync(options={base64:true,quality:0});
        //const {base64} = await camera.takePictureAsync(options={base64:true,quality:0});
        console.log("base64 len" + photo.base64.length)
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        //console.log(base64regex.test("U29tZVN0cmluZ09idmlvdXNseU5vdEJhc2U2NEVuY29kZWQ="));
        console.log("isBase64 ? = " + base64regex.test(photo.base64));
        console.log(photo.uri)
        setPreviewVisible(true)
        
        //save captured photo to state
        setCapturedImage(photo)
        setImageBase64(photo.base64)
        
    }
    const retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        setStartCamera(true)
    }
    const savePhoto = () => {
        setStartCamera(false)
        //console.log("saved pic uri = " + capturedImage.uri)
        //const base64 = FileSystem.readAsStringAsync(capturedImage.uri, { encoding: 'base64' })
        //setImageBase64(capturedImage)
        console.log(typeof imageBase64)
        //fetch((capturedImage.uri).replace("file:///","file:/")).then((res)=>{setBlob(res.blob())});
        //console.log("blob is : ",blob);
        if(isPredcit) predictPicture()
        if(isOCR) readPicture()
    }

    const predictPicture = () =>{
        const current = new Date();
        
        //const blob =  response.blob;
        

        setLoading(true);
        setIsPredict(false);
        //console.log("base64-ed image = " + imageBase64)
        //let formData = new FormData();
        //formData.append("file", imageBase64);
        //dconsole.log(typeof imageBase64, JSON.stringify(imageBase64))
        //console.log("formData : " + formData.get("file"))

        fetch('http://' + config.serverIp + '/api/predict', {
            method: 'POST',
            //body: formData,
            body: JSON.stringify({
                'file': imageBase64,
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

    const readExpiryDate =()=>{
        setIsOCR(true);
        readyCamera();
    }
    const readPicture = () =>{
        setLoading(true)
        setIsOCR(false)
        console.log("capturedImage base len = " + capturedImage.base64.length)

        fetch(config.GOOGLE_VISION_REQUEST_URL, {
        method: 'POST',
        body: JSON.stringify({
            requests: [
            {
                image: {
                content: capturedImage.base64,
                },
                features: [
                { type: 'TEXT_DETECTION', maxResults: 5 },
                ],
                "imageContext": {
                    "languageHints": ["en-t-i0-handwrit"]
                }
            },
            ],
        }),
        })
        .then((res) => res.json())
        .then((data) => {
            //console.log(JSON.stringify(data))
            //console.log(data.responses[0].fullTextAnnotation.text)
            setRead(data.responses[0].fullTextAnnotation.text);
            
        })
        .catch((err) => console.log('error : ', err));
        
        
        //console.log(resultFromUri)
        
    }
    const getExpiryDate =()=>{
        let splited = read.split("\n");
        
        
        setRead(splited.join(" "))
        splited = read.split(" ");
        console.log("splited = ", splited)
        let regex = RegExp(/^(\d{4})?.(0[1-9]|1[012]).(0[1-9]|[12][0-9]|3[01])$/);

        splited.forEach((str)=>{
            
            if(regex.test(str)){
                console.log("str = "+str)
                setExpiryDate(str);
            }
        })
        setLoading(false)
    }

    useEffect(() => {
        getUserInfo();
        //console.log(ok);

    }, []);
    useEffect(()=>{
        getExpiryDate();
    },[read])


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
                            <Text
                                style={{
                                fontSize: 20,
                                color: 'white',
                                textAlign: 'center',
                                marginBottom: 0,
                                fontSize: 50
                                }}>
                                {"Add a new food"}

                            </Text>
                            <Image
                                source={require('../../src/newFood.png')}
                                style={{
                                    //width: '70%',
                                    height: 130,
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
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={0.5}
                                onPress={readExpiryDate}>
                                <Text style={styles.buttonTextStyle}>Read expiry date</Text>
                            </TouchableOpacity>
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
                            style={styles.addButtonStyle}
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
        marginLeft: 10,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 25,
        paddingHorizontal: 10,
    },
    addButtonStyle: {
        backgroundColor: '#7DE24E',
        borderWidth: 0,
        color: '#FFFFFF',
        borderColor: '#7DE24E',
        height: 40,
        alignItems: 'center',
        borderRadius: 30,
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10,
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
    //console.log('photo', photo)
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
