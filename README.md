# onesignal-pushnotifications-form

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Description
This is a mini-service for generating and sending push notifications to the phones of users who are connected to the OneSignal network to a specific project.
Sending pushes to phones is done using OneSignal software.

APIs and keys from OneSignal are test, free. Of course there are no users there now:)

The number of users that we can specify using the User ID in a special field is not limited. The request will be divided into smaller, 100 users each.
It was tested on several tens of thousands of real users.

If you send an empty field, the notification should be sent to everyone.

You can specify the date of delayed sending push notifications to the phone. This is the date and time when the user receives the notification, but it will be in HIS time zone.

I used a test mock of the data to demonstrate how this all works.

The number of push campaigns that can be simultaneously on the page is not limited.
