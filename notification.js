import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { PermissionStatus } from 'expo-modules-core';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notificationPermissions, setNotificationPermissions] = useState(PermissionStatus.UNDETERMINED);

  useEffect(() => {
    const { status } = Notifications.requestPermissionsAsync();
    setNotificationPermissions(status);
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return null;
}
const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    //setNotificationPermissions(status);
    return status;
};

export async function foodNotification(expDate, food) {
    const trigger = expDate
    const id = await Notifications.scheduleNotificationAsync({
    content: {
        title: "NengTimer Alert!",
        body: "your food" + food + "is about to expired!",
        // sound: 'default',
    },
    trigger: trigger,
    });
    console.log("notif id on scheduling", id);
    return id;
}

async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    .then(async(existingStatus)=>{
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        .then((status) => {
          if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
          }
          return status;
        })
    }  
    });
    
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: true,
        lightColor: "#FF231F7C",
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
    });
    }

    return token;
}

export async function cancelNotification(notifId) {
    await Notifications.cancelScheduledNotificationAsync(notifId);
}
