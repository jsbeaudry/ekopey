import React from 'react'
import { ThemeProvider } from 'react-native-elements'
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { RootSiblingParent } from 'react-native-root-siblings'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from './redux/store'

import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading'
import * as Sentry from '@sentry/react-native'

import Welcome from '@components/Welcome'
import Onboarding from '@components/Onboarding'
import Inicial from '@components/Inicial'
import Signup from '@components/Signup'
import Profile from '@components/Profile'
import Wallets from '@components/Wallets'
import RechargeWallet from '@components/RechargeWallet'
import Settings from '@components/Settings'

import CustomDrawerContent from '@components/CustomDrawerContent'
import ForgotPassword from '@components/ForgotPassword'
import RootNavigation from '@components/RootNavigation'

import { customFonts } from '@utils/constants'

import theme from '@config/theme'

const Stack = createStackNavigator()
const queryClient = new QueryClient()

Sentry.init({
  dsn: 'https://56c7cbe572fe4ca7b77490e186796e50@o938527.ingest.sentry.io/5889710',
  enableNative: false,
})

const App = () => {
  const [fontsLoaded] = useFonts(customFonts)

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <RootSiblingParent>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ActionSheetProvider>
            <Stack.Navigator initialRouteName="Welcome" headerMode="none">
              <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="Inicial"
                component={Inicial}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="Home"
                component={RootNavigation}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="RechargeWallet"
                component={RechargeWallet}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="Profile"
                component={Profile}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="Wallets"
                component={Wallets}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="Signup"
                component={Signup}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />

              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="CustomDrawerContent"
                component={CustomDrawerContent}
                options={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              />
            </Stack.Navigator>
          </ActionSheetProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </RootSiblingParent>
  )
}
const ConnectedApp = connectActionSheet(App)

const Drawer = createDrawerNavigator()

function MyDrawer() {
  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
              <Drawer.Screen
                name="Acceuil"
                component={ConnectedApp}
                options={({ route }) => {
                  const routeInit = getFocusedRouteNameFromRoute(route)
                  const routeName = routeInit ? routeInit : 'Welcome'
                  if (
                    routeName == 'Welcome' ||
                    routeName == 'Onboarding' ||
                    routeName == 'Signup' ||
                    routeName == 'Inicial' ||
                    routeName == 'ForgotPassword' ||
                    routeName == 'ResetPassword'
                  )
                    return { swipeEnabled: false }
                }}
              />
              {/* <Drawer.Screen name="Profile" component={Profile} /> */}
            </Drawer.Navigator>
          </PersistGate>
        </Provider>
      </ThemeProvider>
    </NavigationContainer>
  )
}

export default MyDrawer
