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
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native'
import { makeStyles, useTheme, Header, Button } from 'react-native-elements'
import { Ionicons, Feather } from 'react-native-vector-icons'
import { ScreenWidth } from 'react-native-elements/dist/helpers'
import { getData } from '@utils/storage'
import { BACKEND_URL } from '@utils/constants'
import { connect } from 'react-redux'
import axios from 'axios'
import { RFValue } from 'react-native-responsive-fontsize'
import { setUser, setAddress } from '@reduxActions/user'

import { createWallet } from '@services/solana'
import { userUpdate } from '@services/user'

const techImage = require('@assets/images/techimage.jpg')

const Wallets = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [wallet, setWallet] = useState(null)

  useEffect(() => {
    // setUser(props.user.user)
    getUser()
  }, [])

  const getUser = () => {
    // Request API.

    const userdata = props.user.user
    // alert(userdata.id)
    let req = `${BACKEND_URL}/users/${userdata.id}`

    axios
      .get(req, {
        headers: {
          Authorization: `Bearer ${props.user.token}`,
        },
      })
      .then(response => {
        // Handle success.
        setWallet(response.data.walletid)
        const storeUser = {
          token: props.user.token,
          user: response.data,
        }
        props.setUser(storeUser)
      })
      .catch(error => {
        console.log('Bad', error)
      })
  }

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
          centerComponent={{ text: 'Wallets', style: { color: theme.colors.white, fontSize: 20 } }}
          rightComponent={() => (
            <View style={{ flexDirection: 'row' }}>
              {!wallet && (
                <Feather
                  name="plus"
                  color={theme.colors.white}
                  size={30}
                  onPress={() => {
                    createWallet()
                      .then(async response => {
                        // Handle success.
                        setWallet(response.data)
                        userUpdate(props.user.user.id, { walletid: response.data }, props.user.token).then(rep => {
                          getUser()
                        })
                      })
                      .catch(error => {
                        console.log('Bad', error)
                      })
                  }}
                />
              )}
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

      {wallet && (
        <View
          onPress={() => {}}
          key={i}
          style={{
            paddingVertical: 20,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#aaa',
            margin: 10,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              name="wallet-outline"
              // color={theme.colors.white}
              size={RFValue(35)}
              onPress={() => {}}
            />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', width: 250, marginBottom: 10 }}>{wallet.publicKey}</Text>
              <Text style={{ fontSize: 13, fontWeight: '300', color: theme.colors.grey2, marginTop: 2 }}>
                Created alt: {new Date(wallet.createdAt).toDateString()}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Your Private key',
                  `Keep it safe, you loose it yo loose your account\n\n ${wallet.secretKey}`,
                  [
                    {
                      text: 'Non',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'OUI',
                      onPress: () => {
                        // setModalSendCash(true)
                        // props.navigation.navigate('DetailsExam', { code: data })
                      },
                    },
                  ],
                  { cancelable: false },
                )
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '800',
                  color: 'navy',
                }}>
                {'Get my private key'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Your Seed phrase key',
                  `Keep it safe, you loose it yo loose your account\n\n ${wallet.mnemonic}`,
                  [
                    {
                      text: 'Non',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    {
                      text: 'OUI',
                      onPress: () => {
                        // setModalSendCash(true)
                        // props.navigation.navigate('DetailsExam', { code: data })
                      },
                    },
                  ],
                  { cancelable: false },
                )
              }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '800',
                  color: 'purple',
                  marginLeft: 20,
                }}>
                {'Get my seed phrase'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Text
        style={{
          fontSize: 17,
          fontWeight: '800',
          color: '#666',
          marginHorizontal: 50,
          textAlign: 'center',
          color: 'orange',
          marginBottom: 20,
        }}>
        {'NOTICE'}
      </Text>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '400',
          color: '#666',
          marginHorizontal: 50,
          textAlign: 'center',
        }}>
        {`This is your Solana Blockchain wallet. Keep the private key and the seed phrase out of people eyes. If you loose these elements you automaticaly loose your money.`}
      </Text>

      <Text
        style={{
          fontSize: 13,
          fontWeight: '400',
          color: '#666',
          marginHorizontal: 50,
          textAlign: 'center',
          marginTop: 20,
        }}>
        {`To secure your codes we use AES-256 algorithm that is very powerful. This algorithm has never been hack. `}
      </Text>
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
