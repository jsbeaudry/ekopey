export default {
  name: 'EKOPEY',
  icon: './assets/images/logo-white.png',
  version: '1.0.0',
  slug: 'ekopey',
  description: 'Ekopey Wallet Mobile App',
  githubUrl: 'https://github.com/jsbeaudry/ekopey',
  ios: {
    bundleIdentifier: 'com.ekopey.global.app',
    buildNumber: '1.0.0',
  },
  android: {
    package: 'com.ekopey.global.app',
    googleServicesFile: './google-services.json',
    versionCode: 1,
  },
  plugins: [
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: '' | [],
        enableGooglePay: false,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/logo-white.png',
        color: '#ffffff',
        mode: 'production',
      },
    ],
  ],
}
