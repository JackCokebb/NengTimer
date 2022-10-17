import {Camera} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

const CameraScreen = async ({ navigation })=>{

    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            const galleryStatus = await ImagePicker.requestCameraRollPermissionAsync();
            setHasGalleryPermission(galleryStatus.status === "granted")
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    


}

