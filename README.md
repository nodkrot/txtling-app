# Txtling App

React Native application with Redux.


## Getting Started

https://facebook.github.io/react-native/docs/getting-started.html#requirements

```
brew install yarn --without-node # assuming you use nvm
brew install watchman
npm install -g react-native-cli

yarn install
react-native link
```

To run the app in simulator open project in Xcode and press play or use this command in terminal

```
react-native run-ios
```


## TestFlight and Release

- Get an App ID
- Set up AppIcon and LaunchImage in `Images.xcassets`
- Make sure to bump the **Build** [reference](http://stackoverflow.com/questions/4933093/cfbundleversion-in-the-info-plist-upload-error)
- <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd><</kbd> - Switch Debug to Release
- Set device destination to "Generic iOS Device" or an actual (connected) iOS device
- During Product -> Archive might be an issue with certificate (keychain access)

React Native reference: https://facebook.github.io/react-native/docs/upgrading.html

TestFlight reference: https://www.raywenderlich.com/101790/ios-beta-testing-with-testflight-tutorial

Icon and Launch Screen references:

http://stackoverflow.com/questions/34027270/ios-launch-screen-in-react-native

http://ticons.fokkezb.nl


## Linked packages

- react-native-speech
- react-native-contacts
- react-native-vector-icons
- react-native-message-composer
- react-native-google-analytics-bridge


## Push notifications setup

- Get development and production certificates from Apple ([tutorial](https://www.raywenderlich.com/123862/push-notifications-tutorial)) and ([tutorial](https://medium.com/@dmccoy/how-to-get-an-apple-push-notification-service-certificate-as-a-p12-e124c64093c0))
    - Get certificate signing request ([tutorial](http://stackoverflow.com/questions/12126496/how-to-obtain-certificate-signing-request))
    - Download development and production certificates
    - Add these certificates to Keychain
    - Export them as .p12 files
- Create platform application using certificate ([tutorial](http://docs.aws.amazon.com/sns/latest/dg/mobile-push-send-register.html))
    - Create AWS account ([tutorial](http://docs.aws.amazon.com/sns/latest/dg/mobile-push-apns.html))
    - Upload dev/prod certs to your push service (AWS SNS)
    - Keep in mind that for Testflight you need production APNS certificate
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


## Development notes

Packages to deprecate:

- `firebase-util`
    - Upgrade `firebase`
- `react-native-invertible-scroll-view`
    - Upgrade `react-native`
- `jest-react-native`


Play sound in silent mode iOS [read here](https://stackoverflow.com/questions/10322040/how-to-play-a-sound-using-avaudioplayer-when-in-silent-mode-in-iphone/12868879#12868879)

## Debugging on a device with Chrome Developer Tools

https://facebook.github.io/react-native/docs/debugging.html#debugging-on-a-device-with-chrome-developer-tools
