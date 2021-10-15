/* eslint-disable indent */
import React, { useEffect, useState } from 'react'
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native'
import { makeStyles, useTheme } from 'react-native-elements'
import { Feather } from 'react-native-vector-icons'
import { ScreenHeight } from 'react-native-elements/dist/helpers'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { connect } from 'react-redux'
import { setUserOut } from '@reduxActions/user'
import { RFValue } from 'react-native-responsive-fontsize'
const techImage = require('@assets/images/techimage.jpg')

const CustomDrawerContent = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  return (
    <DrawerContentScrollView {...props} scrollEnabled={false} style={{ backgroundColor: '#070728' }}>
      <View style={{ height: ScreenHeight }}>
        {/* <Text>{props.user && props.user.user ? JSON.stringify(props.user.user) : ''}</Text> */}
        {props.user && props.user.user && (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <ImageBackground style={{ width: '100%', height: 200, alignItems: 'center' }} source={techImage}>
              <TouchableOpacity
                onPress={() => {
                  props.setUserOut()
                  props.navigation.navigate('Inicial')
                }}
                style={{
                  padding: 10,
                  borderTopColor: theme.colors.grey1,
                  borderTopWidth: 1,
                  alignSelf: 'flex-end',
                  backgroundColor: '#fafafa',
                }}>
                <Feather name="log-out" size={30} color={theme.colors.black} />
              </TouchableOpacity>
              {/* <Profile /> */}
              <View
                style={{
                  height: 70,
                  width: 70,
                  backgroundColor: Platform.OS === 'ios' ? '#fbfbfb' : '#ffffff',
                  shadowColor: 'rgba(100,100,100,0.9)',
                  shadowOffset: {
                    height: 0,
                    width: 0,
                  },
                  shadowRadius: 7,
                  shadowOpacity: 1,

                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 10,
                  marginBottom: 5,
                }}>
                <Image
                  source={
                    props.user && props.user.user.avatar
                      ? {
                          uri: props.user.user.avatar,
                        }
                      : require('@assets/images/Defaultlt_User_Avatar.png')
                  }
                  resizeMode="cover"
                  style={{ height: 65, width: 65, borderRadius: 100 }}
                />
              </View>

              {props.user && props.user.user.firstname && props.user.user.lastname && (
                <Text style={{ fontSize: 15, color: '#fff', fontWeight: '700', marginVertical: 5 }}>
                  {props.user.user.firstname + ' ' + props.user.user.lastname}
                </Text>
              )}
              <Text style={{ fontSize: 13, color: '#fff', fontWeight: '400', marginVertical: 5 }}>
                {props.user && props.user.user && props.user.user.email}
              </Text>
            </ImageBackground>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Profile')
              }}
              style={{
                flexDirection: 'row',
                padding: 20,
                width: '100%',
                borderTopColor: theme.colors.grey1,
                borderBottomColor: theme.colors.grey1,

                borderTopWidth: 1,
                borderBottomWidth: 1,

                alignItems: 'center',
                // backgroundColor: '#fafafa',
              }}>
              <Feather name="user" size={30} color={theme.colors.white} />

              <Text style={{ marginLeft: 10, color: '#fff', fontSize: 13, fontWeight: '500' }}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Wallets')
              }}
              style={{
                flexDirection: 'row',
                padding: 20,
                width: '100%',
                borderBottomColor: theme.colors.grey1,

                borderBottomWidth: 1,

                alignItems: 'center',
                // backgroundColor: '#fafafa',
              }}>
              <Feather name="book" size={30} color={theme.colors.white} />

              <Text style={{ marginLeft: 10, color: '#fff', fontSize: 13, fontWeight: '500' }}>Wallets</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('RechargeWallet')
              }}
              style={{
                flexDirection: 'row',
                padding: 20,
                width: '100%',
                borderBottomColor: theme.colors.grey1,

                borderBottomWidth: 1,

                alignItems: 'center',
                // backgroundColor: '#fafafa',
              }}>
              <Feather name="dollar-sign" size={30} color={theme.colors.white} />

              <Text style={{ marginLeft: 10, color: '#fff', fontSize: 13, fontWeight: '500' }}>Recharge my wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Settings')
              }}
              style={{
                flexDirection: 'row',
                padding: 20,
                width: '100%',
                borderBottomColor: theme.colors.grey1,

                borderBottomWidth: 1,

                alignItems: 'center',
                // backgroundColor: '#fafafa',
              }}>
              <Feather name="settings" size={30} color={theme.colors.white} />

              <Text style={{ marginLeft: 10, color: '#fff', fontSize: 13, fontWeight: '500' }}>Settings</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </DrawerContentScrollView>
  )
}

const useStyles = makeStyles((theme, props) => ({}))

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
})

const mapDispatchToProps = {
  setUserOut,
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerContent)
