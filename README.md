# AppOne

React Native application with Redux for quick app bootstrapping.


## Getting Started

https://facebook.github.io/react-native/docs/getting-started.html#requirements

```
npm install -g react-native-cli rnpm
npm install
react-native link
```

To run the app in simulator open project in Xcode and press play or use this command in terminal

```
react-native run-ios
```


## TestFlight and Release

- Get an App ID
- Set up AppIcon and LaunchImage in `Images.xcassets`
- Make sure to bump the **Build**
- <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd><</kbd> - Switch Debug to Release
- Uncomment local js bundle in `AppDelegate.m`
- Set device destination to "Generic iOS Device" or an actual (connected) iOS device
- During Product -> Archive might be an issue with certificate (keychain access)

React Native reference: https://facebook.github.io/react-native/docs/upgrading.html

TestFlight reference: https://www.raywenderlich.com/101790/ios-beta-testing-with-testflight-tutorial

Icon and Launch Screen references:

http://stackoverflow.com/questions/34027270/ios-launch-screen-in-react-native

http://ticons.fokkezb.nl


## Push notifications setup

- Create AWS account ([tutorial](http://docs.aws.amazon.com/sns/latest/dg/mobile-push-apns.html))
- Configure and register for push notifications ([tutorial](https://www.raywenderlich.com/123862/push-notifications-tutorial))
    - Keep in mind that for Testflight you need production APNS certificate
- Create platform application using certificate ([tutorial](http://docs.aws.amazon.com/sns/latest/dg/mobile-push-send-register.html))
- Create Amazon IAM user with SNS permissions
    - accessKeyId
    - secretAccessKey
    - region
- Client ([tutorial](https://medium.com/@DannyvanderJagt/how-to-use-push-notifications-in-react-native-41e8b14aadae#.jc9dyzz58))
    - React Native - [PushNotificationIOS](https://facebook.github.io/react-native/docs/pushnotificationios.html)
    - In the app `PushNotificationIOS.requestPermissions()`
    - Get and store device token `PushNotificationIOS.addEventListener('register', ...`
- Server ([tutorial](https://gist.github.com/nodkrot/86d5c7685b2e1d8303d0bc232a394534))
    - Install AWS SDK `npm i aws-sdk -S`
    - Configurations: `PlatformApplicationArn` and `Token` (Device Token from the client)
    - Create endpoint with `sns.createPlatformEndpoint` ([tutorial](http://docs.aws.amazon.com/sns/latest/dg/mobile-platform-endpoint.html))
    - Publish through `sns.publish`


## Migrating react native app

- Move and updated code base (/app)
- Move and install package.json dependencies
- Link native modules `react-native link`
- Update AppDelegate.m file with changes
    - PushNotificationsIOS core module
- Info.plist configs
    - SSL only domain exceptions
    - Description for using native APIs


## Fixes for issues after migration

##### react-native-camera has been removed due to issues
https://github.com/lwansbrough/react-native-camera/issues/386

##### iOS10 issue with descriptions for contacts
https://github.com/lwansbrough/react-native-camera/issues/426
