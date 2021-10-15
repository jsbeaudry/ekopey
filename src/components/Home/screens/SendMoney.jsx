import React, { useState, useEffect } from 'react'
import {
  View,
  Platform,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import Toast from 'react-native-root-toast'
import { makeStyles, useTheme } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { Ionicons, Feather } from 'react-native-vector-icons'
import { connect } from 'react-redux'
import { getAccountTokens, sendMoney } from '@services/solana'
import { userSearch, userAddTx } from '@services/user'
import * as Notifications from 'expo-notifications'
import { sendPushNotification } from '@services/notifications'
import { USDC_ADDRESS, USDC_DECIMAL } from '@utils/constants'
import { NETWORK } from '@env'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})
const happy = require('@assets/images/happy.png')

// cons ScreenHeight
const Home = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [scanned, setScanned] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const [modalSendCash, setModalSendCash] = useState(false)
  const [sending, setSending] = useState(false)
  const [hasSend, setHasSend] = useState(false)

  const [message, setMessage] = useState('')

  const [address, setAddress] = useState('')
  const [username, setUsername] = useState('')

  const [amount, setAmount] = useState('')
  const [receiver, setReceiver] = useState(null)

  const [accountToken, setAccountToken] = useState(null)
  const { publicKey = '', mnemonic = '' } = props.user.user && props.user.user.walletid ? props.user.user.walletid : {}

  useEffect(() => {
    setSending(false)
    setMessage('')
    if (props.username) {
      getReceiverInfo(props.username)
    }
  }, [])

  useEffect(() => {
    tokenBalance()
  }, [])

  const getReceiverInfo = val => {
    userSearch(val, props.user.token).then(resp => {
      if (resp && resp.data && resp.data.length > 0) {
        setReceiver(resp.data[0])
        setUsername(resp.data[0].username)

        if (resp.data[0].walletid === null) {
          Toast.show(`No wallet found for ${resp.data[0].username}`, {
            duration: 6000,
            position: Toast.positions.TOP,
            animation: true,
            backgroundColor: 'orange',
          })
        } else {
          if (resp.data[0] && resp.data[0].walletid && resp.data[0].walletid.publicKey)
            setAddress(resp.data[0].walletid.publicKey)
        }
      } else {
        Toast.show(`No account found for ${username}`, {
          duration: 6000,
          position: Toast.positions.TOP,
          animation: true,
          backgroundColor: 'red',
        })
        setReceiver(null)
        // setUsername('')
        setAddress('')
      }
    })
  }
  const tokenBalance = () => {
    if (publicKey) {
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
  }

  const handleBarCodeScanned = ({ data }) => {
    if (data.includes('username')) {
      let rep = JSON.parse(data)

      setScanned(false)
      setModalVisible(false)
      getReceiverInfo(rep.username)
    } else {
      setScanned(false)
      setModalVisible(false)
      Toast.show(`Not support this QRcode `, {
        duration: 3000,
        position: Toast.positions.BOTTOM,
        animation: true,
        backgroundColor: 'red',
      })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa', marginTop: 0 }}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'dark-content'} />

      {hasSend === false ? (
        <View
          style={[
            styles.centeredView,
            {
              shadowColor: 'rgba(0,0,0,0.1)',
              shadowOffset: {
                height: 0,
                width: 0,
              },
              shadowRadius: 6,
              shadowOpacity: 1,
              backgroundColor: Platform.OS === 'ios' ? '#fafafa' : '#fafafa',
            },
          ]}>
          <View style={styles.inputWapper}>
            <TextInput
              placeholder="Receiver"
              autoCapitalize="none"
              placeholderTextColor={theme.colors.placeholderColor}
              style={styles.inputStyle}
              value={username}
              onChangeText={text => setUsername(text)}
            />

            <Ionicons
              name="qr-code-outline"
              color="#000"
              style={[styles.iconStyleEye]}
              onPress={() => {
                setModalSendCash(false)
                setModalVisible(true)
              }}
            />
            <Ionicons
              name={'search'}
              color="#000"
              style={[styles.iconStyleEye]}
              onPress={() => {
                if (username !== props.user.user.username) {
                  getReceiverInfo(username)
                }
              }}
            />
          </View>
          {receiver && (
            <View
              style={[
                styles.inputWapper,
                { justifyContent: 'space-between', backgroundColor: '#fff', borderColor: '#f3f3f3', borderWidth: 1 },
              ]}>
              <View style={{ flexDirection: 'row' }}>
                <Image
                  source={require('@assets/images/Defaultlt_User_Avatar.png')}
                  resizeMode="cover"
                  style={{ width: 50, height: 50, borderRadius: 10, marginLeft: 10 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 11 }}>{receiver.email}</Text>
                  <Text style={{ fontSize: 11, marginVertical: 3 }}>@{receiver.username}</Text>
                  <Text style={{ fontSize: 11 }}>Since: {new Date(receiver.createdAt).toLocaleDateString()}</Text>
                </View>
              </View>

              <Feather
                name={receiver.walletid && receiver.walletid.publicKey ? 'user-check' : 'user-x'}
                style={[
                  styles.iconStyleEye,
                  {
                    fontSize: 25,
                    color: receiver.walletid && receiver.walletid.publicKey ? 'green' : 'orange',
                  },
                ]}
              />
            </View>
          )}
          <View style={styles.inputWapper}>
            <TextInput
              placeholder="Amount"
              keyboardType="decimal-pad"
              returnKeyType="done"
              placeholderTextColor={theme.colors.placeholderColor}
              style={styles.inputStyle}
              value={amount}
              onChangeText={text => {
                setAmount(text)
              }}
            />
            <Feather name="dollar-sign" style={[styles.iconStyleEye]} />
          </View>
          {address !== '' &&
            receiver &&
            receiver.username !== props.user.user.username &&
            receiver.walletid &&
            receiver.walletid.publicKey &&
            accountToken &&
            parseFloat(amount) > 0 &&
            parseFloat(amount) <= parseFloat(accountToken.amount / 10 ** accountToken.decimals) && (
              <View>
                {sending === false ? (
                  <TouchableOpacity
                    style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
                    onPress={async () => {
                      setSending(true)
                      setMessage('')
                      sendMoney(
                        {
                          phrase: mnemonic,
                          receiver: address,
                          amount: parseFloat(amount),
                          tokenid: USDC_ADDRESS,
                          tokenDecimal: USDC_DECIMAL,
                        },
                        props.user.token,
                      )
                        .then(async resp => {
                          // console.log('success', resp.data)
                          if (resp && resp.data && resp.data.signature) {
                            await sendPushNotification(receiver.notificationToken, {
                              title: `Hi, ${username} `,
                              body: `${props.user.user.username} came to send you $${amount}`,
                            })
                            await userAddTx(
                              {
                                sender: props.user.user.id,
                                receiver: receiver.id,
                                amount: parseFloat(amount),
                                signature: resp.data.signature,
                                currency: 'USDC',
                                network: NETWORK,
                              },
                              props.user.token,
                            )
                            Toast.show(`You came to send you $${amount} to ${username}`, {
                              duration: 4000,
                              position: Toast.positions.TOP,
                              animation: true,
                              backgroundColor: 'green',
                            })

                            tokenBalance()
                            setSending(false)
                            setReceiver(null)

                            setAddress('')
                            setHasSend(true)
                            props.onReload()
                          } else {
                            setReceiver(null)

                            setAddress('')
                            setSending(false)
                            setMessage(`Error, Money has not been send to ${username}`)

                            Toast.show(`Money has not been send to ${username}`, {
                              duration: 4000,
                              position: Toast.positions.TOP,
                              animation: true,
                              backgroundColor: 'red',
                            })
                          }
                        })
                        .catch(err => {
                          console.log('erro', err)

                          Toast.show(`Money has not been send to ${username}`, {
                            duration: 4000,
                            position: Toast.positions.TOP,
                            animation: true,
                            backgroundColor: 'red',
                          })
                        })
                    }}>
                    <Text style={styles.textStyle}>Send Money</Text>
                  </TouchableOpacity>
                ) : (
                  <ActivityIndicator color="#000" size="large" />
                )}
              </View>
            )}

          <Text style={{ fontSize: 10 }}>{message}</Text>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Image
            source={happy}
            style={{
              width: '100%',
              height: 350,
              resizeMode: 'contain',
            }}
          />
          <View
            style={{
              height: 300,
              width: '100%',
              position: 'absolute',
              bottom: 0,
              backgroundColor: '#0bab64',
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 17,
                alignSelf: 'center',
                textAlign: 'center',
                color: '#fff',
                marginTop: -50,
                fontWeight: '300',
                lineHeight: 30,
              }}>
              {`Money has been sent succesfuly to ${
                username || ''
              } \n Thank you for using EKOPEY \nto make people happy`}
            </Text>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: '#fff', width: 200, marginTop: 30, alignSelf: 'center' }}
              onPress={() => {
                props.onClose()
              }}>
              <Text style={[styles.textStyle, { color: '#000' }]}>Thank you</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
    fontSize: 25,
    paddingRight: 8,
  },
  iconStyleEye: {
    fontSize: 25,
    paddingRight: 8,
  },
}))

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
  address: state.user.address,
  usdc: state.user.usdc,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
