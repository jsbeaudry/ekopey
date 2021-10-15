import React from 'react'
import { View, Image, ImageBackground } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { makeStyles, useTheme, Header } from 'react-native-elements'

import { Feather } from 'react-native-vector-icons'
import { ScreenHeight } from 'react-native-elements/dist/helpers'
import { connect } from 'react-redux'

const logo = require('@assets/images/logo-white.png')
const techImage = require('@assets/images/techimage.jpg')
const Tab = createMaterialTopTabNavigator()
import Following from '../screens/Following'
import Search from '../screens/Search'

// cons ScreenHeight

const MyTabs = props => {
  const { theme } = useTheme()

  return (
    <View style={{ flex: 1, height: ScreenHeight }}>
      <ImageBackground style={{ width: '100%' }} source={techImage}>
        <Header
          backgroundColor={'rgba(0,0,0,0)'}
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content"
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={
            <Image source={logo} style={{ width: 45, height: 45, marginTop: -10, resizeMode: 'contain' }} />
          }
          centerComponent={{ text: '', style: { color: '#fff' } }}
          rightComponent={() => (
            <View style={{ flexDirection: 'row' }}>
              <Feather name="menu" color="#FFFFFF" size={25} onPress={() => props.navigation.openDrawer()} />
            </View>
          )}
        />
      </ImageBackground>

      <Tab.Navigator>
        <Tab.Screen name="FRIENDS LIST" component={Following} />
        <Tab.Screen name="Search USERS" component={Search} />
      </Tab.Navigator>
    </View>
  )
}
const useStyles = makeStyles(() => ({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  centeredView: {
    width: '80%',
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    backgroundColor: '#f3f3f3',
    alignSelf: 'center',
    borderRadius: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
}))

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(MyTabs)
