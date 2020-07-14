/*
 * Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 https://github.com/zo0r/react-native-push-notification
 */

'use strict';

import LoginManager from './LoginManager';

// import firebase from 'react-native-firebase';
// import { Notification } from 'react-native-firebase';
import messaging from '@react-native-firebase/messaging';
import NotifService from './NotifeService';

class PushManager {
    pushToken = null;

    constructor() { 
        this.notif = new NotifService(
            this.onRegister.bind(this),
            this.onNotif.bind(this),
          );
    }
    onRegister(token) {
        //this.setState({registerToken: token.token, fcmRegistered: true});
      }
    
      onNotif(notif) {
      //  Alert.alert(notif.title, notif.message);
      }
    init() {
        try {
            messaging().onTokenRefresh((token) => {
                console.log('Refresh token: ' + token);
            });
            messaging().onMessage(async (message) => {
                console.log('PushManager: FCM: notification: ' + message.data);
                LoginManager.getInstance().pushNotificationReceived(message.data);
            });

            messaging().getToken()
                .then(token => {
                    console.log(token);
                    this.pushToken = token;
                })
                .catch(() => {
                    console.warn('PushManager android: failed to get FCM token');
                });

            // const channel = new firebase.notifications.Android.Channel('voximplant_channel_id', 'Incoming call channel', firebase.notifications.Android.Importance.Max)
            //     .setDescription('Incoming call received');
            // firebase.notifications().android.createChannel(channel);

            this.notif.localNotif(undefined,'Incoming call!!!')
        } catch (e) {
            console.warn('React Native Firebase is not set up. Enable google-services plugin at the bottom of the build.gradle file');
        }

    }

    getPushToken() {
        return this.pushToken;
    }

    showLocalNotification(from) {
        console.log('PushManager: showLocalNotification');
        this.notif.localNotif(undefined,'Incoming call')
        // try {
        //     const notification = new firebase.notifications.Notification()
        //         .setNotificationId('notificationId')
        //         .setTitle('Incoming call');
        //     notification.android.setSmallIcon('ic_vox_notification');
        //     notification
        //         .android.setChannelId('voximplant_channel_id');
        //     firebase.notifications().displayNotification(notification);
        // } catch (e) {
        //     console.warn('React Native Firebase is not set up. Enable google-services plugin at the bottom of the build.gradle file');
        // }

    }

    removeDeliveredNotification() {
        this.notif.cancelAll()
        // try {
        //     firebase.notifications().removeAllDeliveredNotifications();
        // } catch (e) {
        //     console.warn('React Native Firebase is not set up. Enable google-services plugin at the bottom of the build.gradle file');
        // }
    }
}

const pushManager = new PushManager();
export default pushManager;
