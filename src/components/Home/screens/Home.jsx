import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StatusBar,
  Alert,
  Platform,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Linking,
  ActivityIndicator,
} from 'react-native'
import Toast from 'react-native-root-toast'
import Constants from 'expo-constants'
import { setUser } from '@reduxActions/user'
import _ from 'lodash'
import { makeStyles, useTheme, Header } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Ionicons, Feather } from 'react-native-vector-icons'
import { SCREEN_HEIGHT } from '@utils/layout'
import { connect } from 'react-redux'
import QRCode from 'react-qr-code'
import { getAccountTokens, createWallet, getAccountInfo, reFillWallet } from '@services/solana'
import { userUpdate, userGetTx, getUser, userFollowing } from '@services/user'
import * as Notifications from 'expo-notifications'
import SendMoney from './SendMoney'
import CashOutMoney from './CashOutMoney'

import PinCode from '@components/PinCode'
import { USDC_ADDRESS } from '@utils/constants'
import { NETWORK } from '@env'

const logo = require('@assets/images/logo-white.png')
const techImage = require('@assets/images/techimage.jpg')
const avatar = require('@assets/images/Defaultlt_User_Avatar.png')
const avatarMan = require('@assets/images/avatar_man.png')
const avatarWomen = require('@assets/images/avatar_woman.png')

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const timePinInter = 20
// cons SCREEN_HEIGHT
const Home = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalDetails, setModalDetails] = useState(false)
  const [modalQrcode, setModalQrcode] = useState(false)
  const [modalPin, setModalPin] = useState(false)
  const [charginWallet, setCharginWallet] = useState(false)

  const [modalSendCash, setModalSendCash] = useState(false)
  const [modalInvitation, setModalInvitation] = useState(false)
  const [sending, setSending] = useState(false)
  const [expoPushToken, setExpoPushToken] = useState('')
  const notificationListener = useRef()
  const [notification, setNotification] = useState(false)
  const responseListener = useRef()
  const [enteredPin, setEnteredPin] = useState('')

  const [followers, setFollwers] = React.useState([])

  const [username, setUsername] = useState('')

  const [balanceFee, setBalanceFee] = useState(0)

  const [accountToken, setAccountToken] = useState(null)
  const [transaction, setTransaction] = useState(null)

  const [accountTransactions, setAccountTransactions] = useState([])
  const { publicKey = '' } = props.user.user && props.user.user.walletid ? props.user.user.walletid : {}
  const [refreshing, setRefreshing] = React.useState(false)

  useEffect(() => {
    setSending(false)
    setRefreshing(false)
    setCharginWallet(false)

    if (props.user && props.user.user && props.user.user.id) {
      // setTimeout(() => {
      //   if (!props.user.user.pin) {
      //     setModalPin(true)
      //   } else {
      //     setInterval(() => {
      //       if (modalPin === false) {
      //         setModalPin(true)
      //       }
      //     }, 1000 * 60 * timePinInter)
      //   }
      // }, 1000)

      userFollowing(props.user.user.id, props.user.token)
        .then(resp => {
          if (resp && resp.data && resp.data.length > 0) {
            setFollwers(resp.data)
          }
        })
        .catch(erre => {
          console.log(erre)
        })
    }
  }, [])
  useEffect(() => {
    registerForPushNotificationsAsync().then(async token => {
      setExpoPushToken(token)
      if (props.user && props.user.user && props.user.user.notificationToken !== token) {
        await userUpdate(props.user.user.id, { notificationToken: token }, props.user.token)
      }
    })

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      tokenBalance()
      allTransactions()
      setNotification(notification)
    })

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // console.log('lll')
    })

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])
  useEffect(() => {
    tokenBalance()
    allTransactions()

    walletAirdrop()
  }, [])

  const walletAirdrop = () => {
    if (props.user && props.user.user && !props.user.user.walletid) {
      createWallet(props.user.token)
        .then(async response => {
          // Handle success.
          setCharginWallet(true)
          CheckBalance(response.data.publicKey)
          userUpdate(props.user.user.id, { walletid: response.data }, props.user.token).then(rep => {
            getUser(props.user.user.id, props.user.token)
              .then(response => {
                const storeUser = {
                  token: props.user.token,
                  user: response.data,
                }
                props.setUser(storeUser)
              })
              .catch(error => {
                console.log('Bad', error)
              })
          })
        })
        .catch(error => {
          console.log('Bad', error)
        })
    }
  }
  const tokenBalance = () => {
    getAccountInfo(publicKey).then(info => {
      if (info && info.data && info.data.result && info.data.result.value !== null) {
        const bal = info.data.result.value / 10 ** 9

        if (props.user && props.user.user && props.user.user.walletid && props.user.user.walletid.publicKey) {
          if (bal >= 0.000001 && bal < 0.0006 && charginWallet === false) {
            reFillWallet(props.user.user.walletid.publicKey, 0.005, props.user.token).then(resp => {
              if (resp.data.signature) {
                console.log('refill drop fill')
              }
            })
          }
        }

        setBalanceFee(bal)
      } else {
        setBalanceFee(0.0)
      }
    })

    getAccountTokens(publicKey).then(myTokens => {
      if (myTokens && myTokens.data && myTokens.data.result) {
        let d = myTokens.data.result.value.filter(f => JSON.stringify(f.account.data).includes(USDC_ADDRESS))
        if (d && d.length > 0) {
          setAccountToken(d[0].account.data.parsed.info.tokenAmount)
        } else {
          setAccountToken(null)
        }
      }
    })
  }

  const CheckBalance = publicKey => {
    let interv = setInterval(() => {
      getAccountInfo(publicKey).then(info => {
        const bal = info.data.result.value / 10 ** 9
        console.log('Checking balance', bal)
        if (bal > 0) {
          setBalanceFee(bal)
          setCharginWallet(false)
          clearInterval(interv)
        }
      })
    }, 10000)
  }
  const allTransactions = () => {
    if (props.user && props.user.user && props.user.user.id) {
      userGetTx(props.user.user.id, props.user.token).then(myTransactions => {
        if (myTransactions && myTransactions.data) {
          setAccountTransactions(myTransactions.data)
        }
      })
    }
  }
  const permission_ = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    setHasPermission(status === 'granted')
  }

  useEffect(() => {
    permission_()
  }, [])

  const handleBarCodeScanned = ({ data }) => {
    if (data.includes('username')) {
      let rep = JSON.parse(data)

      setScanned(false)
      setModalVisible(false)
      if (rep && rep.username) {
        Alert.alert(
          'Send USDT',
          `Do you really want send money to @${rep.username}?`,
          [
            {
              text: 'No',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                setUsername(rep.username)
                setModalSendCash(true)
              },
            },
          ],
          { cancelable: false },
        )
      }
    } else {
      setScanned(false)
      setModalVisible(false)
      Toast.show(`Not support this QRcode `, {
        duration: 3000,
        position: Toast.positions.TOP,
        animation: true,
        backgroundColor: '#e32636',
      })
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)

    tokenBalance()
    allTransactions()
    setTimeout(() => {
      setRefreshing(false)
    }, 3000)
  }

  if (hasPermission === null) {
    return <Text style={{ alignSelf: 'center' }}>Requesting for camera permission</Text>
  }
  if (hasPermission === false) {
    return <Text style={{ alignSelf: 'center' }}>No access to camera</Text>
  }

  const formatToCurrency = amount => {
    return amount.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
  let dash = []
  return (
    <View style={{ flex: 1, height: SCREEN_HEIGHT, backgroundColor: '#fff' }}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />

      <ImageBackground style={{ width: '100%', height: 120 }} source={techImage}>
        <Header
          backgroundColor={'rgba(0,0,0,0)'}
          statusBarProps={{ barStyle: 'light-content' }}
          barStyle="light-content"
          containerStyle={{ borderBottomWidth: 0 }}
          leftComponent={<Image source={logo} style={{ width: 45, height: 45, marginTop: -10, resizeMode: 'cover' }} />}
          centerComponent={{ text: '', style: { color: '#fff' } }}
          rightComponent={() => (
            <View style={{ flexDirection: 'row' }}>
              <Feather
                name="refresh-cw"
                color="#FFFFFF"
                size={25}
                style={{ marginRight: 20 }}
                onPress={() => {
                  onRefresh()
                }}
              />
              <Feather name="menu" color="#FFFFFF" size={25} onPress={() => props.navigation.openDrawer()} />
            </View>
          )}
        />
      </ImageBackground>
      <View
        style={{
          backgroundColor: '#fff',
          height: 160,
          width: '85%',
          marginVertical: 20,
          // position: 'absolute',
          // top: 140,
          alignSelf: 'center',
          borderRadius: 10,
          zIndex: 1,
          shadowColor: 'rgba(0,0,0,0.1)',
          shadowOffset: {
            height: 0,
            width: 0,
          },
          shadowRadius: 5,
          shadowOpacity: 1,
          backgroundColor: Platform.OS === 'ios' ? '#fafafa' : '#ffffff',
        }}>
        <View
          style={{
            height: 100,
            width: 100,
            position: 'absolute',
            top: -50,
            left: 20,
            borderRadius: 10,
          }}>
          <Image
            source={
              props.user && props.user.user && props.user.user.sex && props.user.user.sex === 'Male'
                ? avatarMan
                : props.user && props.user.user && props.user.user.sex && props.user.user.sex === 'Female'
                ? avatarWomen
                : avatar
            }
            resizeMode="cover"
            style={{ width: '100%', flex: 1, borderRadius: 10 }}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ marginLeft: 130, paddingTop: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '600' }}>
              {props.user && props.user.user && props.user.user.email}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>
              {props.user && props.user.user ? '@' + props.user.user.username : ''}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={{
                url: 'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
              }}
              resizeMode="cover"
              style={{ width: 40, height: 40, marginTop: 20, marginLeft: 20 }}
            />

            <View style={{ padding: 15, marginTop: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>Avalaible Balance</Text>
              <Text style={{ fontSize: 25, fontWeight: '900', marginTop: 5 }}>
                $
                {accountToken && accountToken.amount
                  ? formatToCurrency(accountToken.amount / 10 ** accountToken.decimals)
                  : 0.0}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '900',
                  marginTop: 5,
                  color:
                    balanceFee < 0.00005 ? '#e32636' : balanceFee > 0.00005 && balanceFee < 0.0001 ? 'orange' : 'green',
                }}>
                <Text style={{ fontSize: 10, fontWeight: '900', marginTop: 5, color: '#000' }}>{'Fee balance: '}</Text>
                {balanceFee > 0 ? balanceFee : ''}
                {charginWallet === true && <ActivityIndicator style={{ marginBottom: -10 }} />}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{ marginRight: 10, marginTop: 20 }}
            onPress={() => {
              if (props.user.user && props.user.user && props.user.user.walletid) {
                setModalQrcode(true)
              } else {
                Toast.show(`No wallet found `, {
                  duration: 3000,
                  position: Toast.positions.TOP,
                  animation: true,
                  backgroundColor: 'orange',
                })
              }
            }}>
            <Ionicons name={'qr-code-outline'} size={55} style={{ color: '#000' }} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{}}
        refreshControl={<RefreshControl style={{ zIndex: 999 }} refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
          <View style={{ paddingTop: 10, alignItems: 'center' }}>
            <Image source={require('@assets/images/im1.png')} style={{ width: 80, height: 80, resizeMode: 'cover' }} />
            <TouchableOpacity
              onPress={() => {
                setModalInvitation(true)
              }}
              style={{
                height: 40,
                borderRadius: 5,
                width: 120,
                backgroundColor: 'navy',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: theme.colors.white }}>CASH OUT</Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingTop: 10, alignItems: 'center' }}>
            <Image
              source={require('@assets/images/qr_code.png')}
              style={{ width: 80, height: 80, resizeMode: 'cover' }}
            />
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true)
              }}
              style={{
                height: 40,
                borderRadius: 5,
                width: 120,
                backgroundColor: 'purple',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: theme.colors.white }}>SCAN</Text>
            </TouchableOpacity>
          </View>
          <View style={{ paddingTop: 10, alignItems: 'center' }}>
            <Image source={require('@assets/images/im3.png')} style={{ width: 80, height: 80, resizeMode: 'cover' }} />
            <TouchableOpacity
              onPress={() => {
                setSending(false)
                setModalSendCash(true)
                // props.navigation.navigate('SendMoney')
              }}
              style={{
                height: 40,
                borderRadius: 5,
                width: 120,
                backgroundColor: 'green',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 12, fontWeight: '800', color: theme.colors.white }}>SEND CASH</Text>
            </TouchableOpacity>
          </View>
        </View>
        {accountTransactions && accountTransactions.length === 0 && (
          <View>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: 20,
                fontWeight: '900',
                marginTop: 60,
                color: theme.colors.grey2,
              }}>
              OUPP'S
            </Text>
            <Text style={{ alignSelf: 'center', marginTop: 10, color: theme.colors.grey2 }}>
              No transactions found for your wallet
            </Text>
          </View>
        )}
        {accountTransactions && accountTransactions.length > 0 && (
          <View style={{}}>
            <Text style={{ marginLeft: 20, marginBottom: 10, fontSize: 17, fontWeight: '700', color: 'purple' }}>
              Latest
            </Text>

            {_.take(
              accountTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
              5,
            ).map((m, i) => (
              <TouchableOpacity
                onPress={() => {
                  setTransaction(m)
                  setModalDetails(true)
                }}
                key={i}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                  alignItems: 'center',
                }}>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={require('@assets/images/Defaultlt_User_Avatar.png')}
                    resizeMode="cover"
                    style={{ width: 40, height: 40, borderRadius: 10 }}
                  />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 15 }}>
                      {props.user && props.user.user && props.user.user.id && m.receiver.id === props.user.user.id
                        ? `${m.sender.username}`
                        : `${m.receiver.username}`}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '300', color: theme.colors.grey2, marginTop: 2 }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleString() : '00-00'}
                    </Text>
                  </View>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text
                    style={{
                      textAlign: 'right',
                      fontSize: 15,
                      fontWeight: '800',
                      color:
                        props.user && props.user.user && props.user.user.id && m.receiver.id === props.user.user.id
                          ? 'green'
                          : '#e32636',
                    }}>
                    {props.user && props.user.user && props.user.user.id && m.receiver.id === props.user.user.id
                      ? `+$${m.amount}`
                      : `-$${m.amount}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalQrcode}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        {props.user && props.user.user && (
          <View style={styles.centeredView}>
            <QRCode value={JSON.stringify({ pubKey: publicKey || '', username: props.user.user.username })} />
            <Text style={[styles.textStyle, { color: 'grey', margin: 10 }]}>
              {`@${props.user.user.username}` || ''}
            </Text>
            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
              onPress={() => {
                setModalQrcode(!modalQrcode)
              }}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableHighlight>
          </View>
        )}
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDetails}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <View
          style={[
            {
              width: '85%',
              // height: 420,
              // justifyContent: 'center',
              paddingVertical: 20,
              marginTop: 100,
              backgroundColor: '#f3f3f3',
              alignSelf: 'center',
              borderRadius: 20,

              shadowColor: 'rgba(0,0,0,0.1)',
              shadowOffset: {
                height: 0,
                width: 0,
              },
              shadowRadius: 5,
              shadowOpacity: 1,
              backgroundColor: Platform.OS === 'ios' ? '#fafafa' : '#ffffff',
            },
          ]}>
          {transaction && transaction.id && (
            <View style={{ padding: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#eee',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    source={require('@assets/images/Defaultlt_User_Avatar.png')}
                    resizeMode="cover"
                    style={{ width: 50, height: 50, borderRadius: 10 }}
                  />
                  <View style={{}}>
                    <Text style={{ fontSize: 13, marginVertical: 3, fontWeight: '500' }}>
                      {transaction.sender.id === props.user.user.id ? '@Me' : `@${transaction.sender.username}`}
                    </Text>
                  </View>
                </View>
                <View style={{ paddingHorizontal: 20 }}>
                  <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: '900' }}>${transaction.amount}</Text>
                  <Text
                    style={{
                      fontSize: 15,
                      alignSelf: 'center',
                      fontWeight: '600',
                      color: transaction.sender.id === props.user.user.id ? '#e32636' : 'green',
                    }}>
                    USDC
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#eee',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Image
                    source={require('@assets/images/Defaultlt_User_Avatar.png')}
                    resizeMode="cover"
                    style={{ width: 50, height: 50, borderRadius: 10 }}
                  />
                  <View style={{}}>
                    <Text style={{ fontSize: 13, marginVertical: 3, fontWeight: '500' }}>
                      {transaction.receiver.id === props.user.user.id ? '@Me' : `@${transaction.receiver.username}`}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={{ fontSize: 20, marginTop: 20, alignSelf: 'center', fontWeight: '600', color: 'green' }}>
                {new Date(transaction.createdAt).toDateString()}
              </Text>

              <Text style={{ fontSize: 20, marginTop: 20, alignSelf: 'center', fontWeight: '600' }}>{'Signature'}</Text>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`https://explorer.solana.com/tx/${transaction.signature}?cluster=${NETWORK}net`)
                }}>
                <Text style={{ fontSize: 12, marginTop: 10, alignSelf: 'center', fontWeight: '600' }}>
                  {'Check on blockchain'}
                </Text>

                <Text
                  style={{
                    fontSize: 10,
                    textAlign: 'center',
                    marginTop: 10,
                    alignSelf: 'center',
                    fontWeight: '600',
                    color: 'purple',
                  }}>
                  {transaction.signature}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableHighlight
            style={{ ...styles.openButton, width: 200, alignSelf: 'center', backgroundColor: '#2196F3' }}
            onPress={() => {
              setModalDetails(!modalDetails)
            }}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableHighlight>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSendCash}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <TouchableOpacity
          style={{ position: 'absolute', padding: 10, right: 13, top: 84, zIndex: 99, padding: 20 }}
          onPress={() => {
            setModalSendCash(!modalSendCash)
          }}>
          <Feather
            name={'x'}
            style={[
              styles.iconStyleEye,
              {
                fontSize: 30,
                color: '#e32636',
              },
            ]}
          />
        </TouchableOpacity>
        <SendMoney
          username={username}
          onClose={() => {
            tokenBalance()
            allTransactions()
            setModalSendCash(false)
          }}
          onReload={() => {
            tokenBalance()
            allTransactions()
          }}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalInvitation}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <TouchableOpacity
          style={{ position: 'absolute', padding: 10, right: 13, top: 84, zIndex: 99, padding: 20 }}
          onPress={() => {
            setModalInvitation(!modalInvitation)
          }}>
          <Feather
            name={'x'}
            style={[
              styles.iconStyleEye,
              {
                fontSize: 30,
                color: '#e32636',
              },
            ]}
          />
        </TouchableOpacity>
        <CashOutMoney
          username={username}
          onClose={() => {
            tokenBalance()
            allTransactions()
            setModalInvitation(false)
          }}
          onReload={() => {
            tokenBalance()
            allTransactions()
          }}
        />

        {/* <View
          style={[
            styles.centeredView,
            {
              height: 270,
              shadowColor: 'rgba(222,222,222,1)',
              shadowOffset: {
                height: 0,
                width: 0,
              },
              shadowRadius: 6,
              shadowOpacity: 1,
              backgroundColor: Platform.OS === 'ios' ? '#fafafa' : '#fafafa',
            },
          ]}>
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', padding: 10, marginRight: 20 }}
            onPress={() => {
              setModalInvitation(false)
            }}>
            <Text style={{ color: '#e32636' }}>CLOSE</Text>
          </TouchableOpacity>
          <View style={styles.inputWapper}>
            <TextInput
              placeholder="Address"
              placeholderTextColor={theme.colors.placeholderColor}
              style={styles.inputStyle}
              value={address}
              onChangeText={text => setAddress(text)}
            />

            <Feather
              name="user"
              color="#000"
              style={[styles.iconStyleEye]}
              onPress={() => {
                // setModalSendCash(false)
                // setModalVisible(true)
              }}
            />
          </View>

          <TouchableOpacity
            style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
            onPress={() => {
              setModalInvitation(!modalInvitation)
            }}>
            <Text style={styles.textStyle}>Invite friend</Text>
          </TouchableOpacity>
        </View>
      */}
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={charginWallet}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <View
          style={[
            {
              flex: 1,
              width: '100%',
              backgroundColor: 'rgba(0,0,0,0.8)',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 10 }}>Please wait for refill your Fees transaction</Text>
        </View>
      </Modal>
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
              height: '100%',
              width: '100%',
              // height: 420,
              // justifyContent: 'center',

              alignItems: 'center',

              backgroundColor: '#fff',
              alignSelf: 'center',
            },
          ]}>
          <PinCode
            text={props.user && props.user.user && !props.user.user.pin ? 'CREATE A PIN' : 'PIN'}
            onChange={val => {
              setEnteredPin(val)

              if (
                val.length === 4 &&
                props.user &&
                props.user.user &&
                props.user.user.pin &&
                props.user.user.pin === val
              ) {
                setModalPin(false)
              }
            }}
          />

          {enteredPin.length === 4 && props.user && props.user.user && !props.user.user.pin && (
            <TouchableOpacity
              style={{
                backgroundColor: '#2196F3',
                width: '100%',
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                userUpdate(props.user.user.id, { pin: enteredPin }, props.user.token).then(rep => {
                  getUser(props.user.user.id, props.user.token)
                    .then(response => {
                      const storeUser = {
                        token: props.user.token,
                        user: response.data,
                      }
                      props.setUser(storeUser)
                      setModalPin(false)
                    })
                    .catch(error => {
                      console.log('Bad', error)
                    })
                })
              }}>
              <Text style={{ color: '#fff', fontSize: 17 }}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </Modal>

      {modalVisible && (
        <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={[StyleSheet.absoluteFillObject, { zIndex: 2 }]}>
          <TouchableHighlight
            style={{
              height: 44,
              width: '80%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.colors.grey0,
              margin: 30,
              position: 'absolute',
              bottom: 0,
              alignSelf: 'center',
            }}
            onPress={() => {
              setScanned(false)
              setModalVisible(false)
            }}>
            <Text style={styles.textStyle}>Close Scanner</Text>
          </TouchableHighlight>
        </BarCodeScanner>
      )}
    </View>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  centeredView: {
    width: '85%',
    // height: 420,
    // justifyContent: 'center',
    paddingVertical: 20,

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
    borderRadius: 5,
    padding: 15,
    elevation: 2,
    marginTop: 20,
    paddingHorizontal: 40,
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
  inputWapper: {
    width: '85%',
    height: 60,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 4,
  },
  inputStyle: {
    color: theme.colors.grey2,
    paddingRight: 5,
    fontSize: 15,
    alignSelf: 'stretch',
    flex: 1,
    paddingHorizontal: 15,
  },
  iconStyleCheck: {
    color: theme.colors.grey3,
    fontSize: 24,
    paddingRight: 8,
  },
  iconStyleEye: {
    fontSize: 25,
    paddingRight: 8,
  },
}))

async function registerForPushNotificationsAsync() {
  let token
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
    // console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
  address: state.user.address,
  usdc: state.user.usdc,
})

const mapDispatchToProps = { setUser }

export default connect(mapStateToProps, mapDispatchToProps)(Home)
