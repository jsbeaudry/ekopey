import * as React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { makeStyles, useTheme } from 'react-native-elements'
import { Feather } from 'react-native-vector-icons'
import { Home, Activities, Friends } from '@components/Home'
import { Layers } from '@components/Layers'

const Tab = createBottomTabNavigator()

const MyTabs = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)
  const customTabBarStyle = {
    activeTintColor: theme.colors.primary,
    inactiveTintColor: 'gray',
    style: styles.container,
  }
  return (
    <Tab.Navigator initialRouteName="Home" activeColor="#fff" tabBarOptions={customTabBarStyle} shifting="false">
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: '',

          tabBarIcon: ({ color }) => <Feather name="home" color={color} size={25} style={{}} />,
        }}
        component={Home}
      />
      <Tab.Screen
        name="Activities"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <Feather name="activity" color={color} size={25} style={{}} />,
        }}
        component={Activities}
      />
      <Tab.Screen
        name="Friends"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <Feather name="users" color={color} size={25} style={{}} />,
        }}
        component={Friends}
      />
      <Tab.Screen
        name="Layers"
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color }) => <Feather name="layers" color={color} size={25} style={{}} />,
        }}
        component={Layers}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return <MyTabs />
}

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: 'white',
    shadowColor: 'rgba(0,0,18,1)',
    shadowOffset: {
      width: 1,
      height: 3,
    },

    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 2,
    paddingTop: 5,
    minHeight: 60,
  },

  navButtonWrapper: {
    width: 80,
    height: 80,
    marginTop: -35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#f7f7f7',
    borderRadius: 100,
  },
  navButton: {
    width: 70,
    height: 70,

    borderRadius: 100,
    justifyContent: 'center',
  },
  iconCenter: {
    color: 'rgba(255,255,255,1)',
    fontSize: 34,
    alignSelf: 'center',
    position: 'relative',
  },
}))
