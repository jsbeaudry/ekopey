import React, { useState, useEffect } from 'react'
import {
  View,
  StatusBar,
  Text,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  ImageBackground,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native'
import { makeStyles, useTheme, Header, Button } from 'react-native-elements'
import { Ionicons, Feather } from 'react-native-vector-icons'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import { getData } from '@utils/storage'
import { BACKEND_URL } from '@utils/constants'
import { connect } from 'react-redux'
import axios from 'axios'
import { RFValue } from 'react-native-responsive-fontsize'
import { setUser, setAddress } from '@reduxActions/user'

import { createWallet } from '@services/solana'
import { userUpdate } from '@services/user'
import PinCode from '@components/PinCode'

const techImage = require('@assets/images/techimage.jpg')

const Wallets = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [wallet, setWallet] = useState(null)
  const [modalPin, setModalPin] = useState(false)

  useEffect(() => {}, [])

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />
      <ImageBackground style={{ width: '100%', height: 80 }} source={techImage}>
        <Header
          backgroundColor={'rgba(0,0,0,0)'}
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content"
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={() => (
            <Ionicons
              name="arrow-back"
              color={theme.colors.white}
              style={{}}
              size={30}
              onPress={() => props.navigation.goBack()}
            />
          )}
          centerComponent={{ text: 'Settings', style: { color: theme.colors.white, fontSize: 20 } }}
          rightComponent={() => (
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name="menu"
                color={theme.colors.white}
                size={30}
                onPress={() => props.navigation.openDrawer()}
              />
            </View>
          )}
        />
      </ImageBackground>
      {[
        // { i: 1, icon: 'keypad-outline', text: 'Secure your account', go: '' },
        // { i: 2, icon: 'wallet-outline', text: 'External Transfers', go: '' },
        // { i: 3, icon: 'cash-outline', text: 'Cash out', go: '' },
        { i: 4, icon: 'document-outline', text: 'Terms and Conditions', go: '' },

        { icon: 'egg-outline', text: 'about', go: '' },
      ].map(m => (
        <TouchableOpacity
          onPress={() => {
            if (m.i === 1) {
              setModalPin(true)
            }
          }}
          key={m.icon}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            marginHorizontal: 20,
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            paddingBottom: 10,
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={m.icon} color={theme.colors.black} size={30} onPress={() => {}} />
            <Text style={{ fontSize: 17, marginHorizontal: 10 }}>{m.text}</Text>
          </View>
          <Ionicons name={'chevron-forward-outline'} color={theme.colors.black} size={30} onPress={() => {}} />
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPin}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <View
          style={[
            {
              height: ScreenHeight,
              width: '100%',
              // height: 420,
              // justifyContent: 'center',

              alignItems: 'center',

              backgroundColor: '#fff',
              alignSelf: 'center',
            },
          ]}>
          <PinCode />

          <TouchableOpacity
            style={{
              backgroundColor: '#2196F3',
              width: '100%',
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              setModalPin(false)
            }}>
            <Text style={{ color: '#fff', fontSize: 17 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}

const useStyles = makeStyles((theme, props) => ({
  container: {
    flex: 1,
    width: '100%',
  },
  keyboardAvoidingStyle: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  inputWapper: {
    width: '90%',
    height: RFValue(44),
    backgroundColor: theme.colors.grey1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 4,
    alignSelf: 'center',
  },
  inputStyle: {
    color: theme.colors.grey2,
    paddingRight: 5,
    fontSize: RFValue(12),
    alignSelf: 'stretch',
    flex: 1,
    paddingHorizontal: 15,
  },
  iconStyleCheck: {
    color: theme.colors.grey3,
    fontSize: RFValue(24),
    paddingRight: 8,
  },
  iconStyleEye: {
    fontSize: RFValue(24),
    paddingRight: 8,
  },
}))

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
})

const mapDispatchToProps = { setUser, setAddress }

export default connect(mapStateToProps, mapDispatchToProps)(Wallets)
