import React, { useState, useEffect } from 'react'
import {
  View,
  StatusBar,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
  TouchableHighlight,
} from 'react-native'

import { Button, makeStyles, useTheme } from 'react-native-elements'

import { connect } from 'react-redux'

import { getApricotData, getAccountTokens, setApricotLending, setApricotWithdraw } from '@services/solana'
import { userAddTx } from '@services/user'

import { USDC_ADDRESS, USDC_DECIMAL } from '@utils/constants'
import { NETWORK } from '@env'
import { userGetTxLend } from '@services/user'

// cons ScreenHeight
const Home = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)
  const [refreshing, setRefreshing] = React.useState(false)
  const [data, setData] = React.useState(null)
  const [accountToken, setAccountToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [accountTransactions, setAccountTransactions] = useState([])
  const [modalDetails, setModalDetails] = useState(false)
  const [transaction, setTransaction] = useState(null)
  const [amount, setAmount] = useState('')
  const [amountWithdraw, setAmountWithdraw] = useState('')

  useEffect(() => {
    setLoading(false)
    getApreicot()
    allTransactions()
  }, [])
  const getApreicot = () => {
    const publicKey = props.user.user.walletid.publicKey
    getApricotData(publicKey, props.user.token)
      .then(rep => {
        if (rep.data && rep.data.user_asset_info && rep.data.user_asset_info.length >= 0) {
          // console.log(rep.data.user_asset_info)
          const usdc = rep.data.user_asset_info.filter(f => f.pool_id === 3)

          if (usdc.length > 0) {
            setData(usdc[0])
          } else {
            setData(null)
          }
        } else {
          setData(null)
        }
      })
      .catch(err => {})

    getAccountTokens(publicKey).then(myTokens => {
      if (myTokens && myTokens.data && myTokens.data.result) {
        let d = myTokens.data.result.value.filter(f => JSON.stringify(f.account.data).includes(USDC_ADDRESS))
        if (d && d.length > 0) {
          // console.log(d[0].account.data.parsed.info.tokenAmount)
          setAccountToken(d[0].account.data.parsed.info.tokenAmount)
        } else {
          setAccountToken(null)
        }
      }
    })
  }
  const allTransactions = () => {
    if (props.user && props.user.user && props.user.user.id) {
      userGetTxLend(props.user.user.id, props.user.token).then(myTransactions => {
        if (myTransactions && myTransactions.data) {
          // console.log(myTransactions.data)
          setAccountTransactions(myTransactions.data)
          // const datas = myTokens.data.filter(f => f.mint.address === props.usdc)
        }
      })
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    getApreicot()
    allTransactions()

    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])
  return (
    <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />

      <ScrollView
        style={{ paddingTop: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <KeyboardAvoidingView style={{}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View
            style={{
              width: '95%',
              borderColor: '#eee',
              borderWidth: 2,
              paddingBottom: 20,
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={{
                  url: 'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
                }}
                resizeMode="cover"
                style={{ width: 40, height: 40, margin: 10, marginLeft: 30 }}
              />
              <View>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>
                  MAX USDC AVAILABLE TO LEND
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: theme.colors.grey2 }}>
                  {accountToken ? parseFloat(accountToken.uiAmount).toFixed(2) : '0.0'}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',

                width: '95%',

                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>Deposit</Text>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>
                  $
                  {data && data.deposit_amount
                    ? parseFloat(data.deposit_amount / 10 ** USDC_DECIMAL).toFixed(4)
                    : parseFloat(0).toFixed(2)}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>Interest</Text>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>
                  $
                  {data && data.deposit_interests
                    ? parseFloat(data.deposit_interests / 10 ** USDC_DECIMAL).toFixed(4)
                    : parseFloat(0).toFixed(2)}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>Reward</Text>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>
                  $
                  {data && data.reward_deposit_amount
                    ? parseFloat(data.reward_deposit_amount / 10 ** USDC_DECIMAL).toFixed(4)
                    : parseFloat(0).toFixed(2)}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>Rates/Y</Text>
                <Text style={{ fontSize: 14, fontWeight: '600' }}>
                  {data && data.deposit_amount ? parseFloat(4.91).toFixed(1) : parseFloat(0).toFixed(2)}%
                </Text>
              </View>
            </View>
          </View>
          {accountToken && (
            <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>
                  Deposit to make profits
                </Text>
                <View style={styles.inputWapper}>
                  <TextInput
                    placeholder="$0.0"
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholderTextColor={theme.colors.placeholderColor}
                    style={styles.inputStyle}
                    value={amount}
                    onChangeText={text => {
                      if (parseFloat(text || '0') <= parseFloat(`${accountToken.uiAmount}`)) {
                        setAmount(text)
                      }
                    }}
                  />
                </View>
                {loading === false ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Button
                      title="Max"
                      titleStyle={{ fontSize: 13, padding: 6 }}
                      buttonStyle={{ backgroundColor: 'purple' }}
                      onPress={() => {
                        setAmount(`${accountToken.uiAmount}`)
                      }}
                    />
                    <Button
                      title="Deposit"
                      titleStyle={{ fontSize: 13, padding: 6 }}
                      containerStyle={{ marginLeft: 10, width: 100 }}
                      onPress={() => {
                        if (amount > 0 && amount < parseFloat(`${accountToken.uiAmount}`)) {
                          setLoading(true)

                          const phrase = props.user.user.walletid.mnemonic
                          setApricotLending({ phrase, amount }, props.user.token)
                            .then(rep => {
                              if (rep.data && rep.data.success === true) {
                                console.log('Deposit', rep.data)
                                setTimeout(async () => {
                                  await userAddTx(
                                    {
                                      sender: props.user.user.id,
                                      receiver: null,
                                      amount: parseFloat(amount),
                                      signature: rep.data.data,
                                      currency: 'USDC',
                                      type: 'LEND',
                                      network: NETWORK,
                                    },
                                    props.user.token,
                                  )

                                  setAmount('')
                                  setLoading(false)
                                  console.log(rep)
                                  getApreicot()
                                  allTransactions()
                                }, 5000)
                              }
                              if (rep.data && rep.data.success === false) {
                                setLoading(false)
                                alert('Funds has not been deposit, please try later 3')
                              }
                            })
                            .catch(err => {
                              setLoading(false)
                              alert('Funds has not been deposit, please try later')
                              console.log(err)
                            })
                          console.log(amount)
                        } else {
                          alert('Please enter the amount')
                        }
                      }}
                    />
                  </View>
                ) : (
                  <ActivityIndicator color="purple" />
                )}
              </View>

              <View>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>
                  Withdraw to take your profits
                </Text>
                <View style={styles.inputWapper}>
                  <TextInput
                    placeholder="$0.0"
                    autoCapitalize="none"
                    keyboardType="numeric"
                    returnKeyType="done"
                    placeholderTextColor={theme.colors.placeholderColor}
                    style={styles.inputStyle}
                    value={amountWithdraw}
                    onChangeText={text => {
                      if (
                        data &&
                        data.deposit_amount &&
                        parseFloat(text || '0') <= parseFloat(`${data.deposit_amount / 10 ** USDC_DECIMAL}`)
                      ) {
                        setAmountWithdraw(text)
                      }
                    }}
                  />
                </View>
                {loading === false ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Button
                      title="Max"
                      titleStyle={{ fontSize: 13, padding: 6 }}
                      buttonStyle={{ backgroundColor: 'purple' }}
                      onPress={() => {
                        setAmountWithdraw(`${parseFloat(data.deposit_amount / 10 ** USDC_DECIMAL).toFixed(5)}`)
                      }}
                    />
                    <Button
                      title="Withdraw"
                      titleStyle={{ fontSize: 13, padding: 6 }}
                      containerStyle={{ marginLeft: 10, width: 100 }}
                      buttonStyle={{ backgroundColor: 'navy' }}
                      onPress={() => {
                        if (
                          data &&
                          data.deposit_amount &&
                          amountWithdraw > 0 &&
                          amountWithdraw <= parseFloat(data.deposit_amount / 10 ** USDC_DECIMAL) &&
                          props.user &&
                          props.user.user &&
                          props.user.user.walletid
                        ) {
                          setLoading(true)
                          const phrase = props.user.user.walletid.mnemonic
                          setApricotWithdraw({ phrase, amount: amountWithdraw }, props.user.token)
                            .then(rep => {
                              if (rep.data && rep.data.success === true) {
                                setTimeout(async () => {
                                  console.log('withdraw', rep.data)
                                  await userAddTx(
                                    {
                                      sender: null,
                                      receiver: props.user.user.id,
                                      amount: parseFloat(amountWithdraw),
                                      signature: rep.data.data,
                                      currency: 'USDC',
                                      type: 'LEND',
                                      network: NETWORK,
                                    },
                                    props.user.token,
                                  )
                                  setAmountWithdraw('')
                                  setLoading(false)

                                  getApreicot()
                                  allTransactions()
                                }, 5000)
                              }
                              if (rep.data && rep.data.success === false) {
                                setLoading(false)
                                alert('Funds has not been withdraw, please try later')
                              }
                            })
                            .catch(err => {
                              setLoading(false)

                              alert('Funds has not been withdraw, please try later')
                              console.log(err)
                            })
                        } else {
                          alert('Please enter the amount')
                        }
                      }}
                    />
                  </View>
                ) : (
                  <ActivityIndicator color="purple" />
                )}
              </View>
            </View>
          )}
        </KeyboardAvoidingView>

        {accountTransactions && accountTransactions.length > 0 ? (
          <View style={{ marginTop: 30, marginBottom: 110 }}>
            {accountTransactions
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

              .map((m, i) => (
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
                    <View style={{ marginLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: '800',
                          color:
                            props.user &&
                            props.user.user &&
                            props.user.user.id &&
                            m.receiver &&
                            m.receiver.id === props.user.user.id
                              ? 'green'
                              : '#e32636',
                          marginTop: 2,
                        }}>
                        ${m.amount} <Text style={{ fontSize: 13, color: theme.colors.grey2 }}>USDC</Text>
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
                        fontSize: 13,
                        fontWeight: '800',
                        color:
                          props.user &&
                          props.user.user &&
                          props.user.user.id &&
                          m.receiver &&
                          m.receiver.id === props.user.user.id
                            ? 'green'
                            : '#e32636',
                      }}>
                      {props.user && props.user.user && m.receiver && m.receiver.id === props.user.user.id
                        ? 'Withdraw'.toUpperCase()
                        : 'Deposit'.toUpperCase()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        ) : (
          <Text
            style={{
              fontSize: 13,
              fontWeight: '400',
              color: '#aaa',
              marginHorizontal: 50,
              marginVertical: 20,
              textAlign: 'center',
            }}>
            {
              'We allow you to place your money on a global fund to be able to make profit. The risk is free, but please make your own research about DEFI Lending'
            }
          </Text>
        )}
      </ScrollView>

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
                      {transaction.sender && transaction.sender.id === props.user.user.id ? '@Me' : `@${'Contract'}`}
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
                      color: transaction.sender && transaction.sender.id === props.user.user.id ? '#e32636' : 'green',
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
                  <View>
                    <Text style={{ fontSize: 13, marginVertical: 3, fontWeight: '500' }}>
                      {props.user &&
                      props.user.user &&
                      transaction.receiver &&
                      transaction.receiver.id === props.user.user.id
                        ? '@Me'
                        : `@${'Contract'}`}
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
    </View>
  )
}

const useStyles = makeStyles((theme, props) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },
  keyboardAvoidingStyle: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
  inputWapper: {
    paddingRight: 10,
    marginTop: 10,
    alignSelf: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#f3f3f3',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: 4,
  },
  inputStyle: {
    color: theme.colors.grey2,
    paddingRight: 5,
    fontSize: 17,
    alignSelf: 'stretch',
    flex: 1,
    paddingHorizontal: 15,
    fontWeight: '700',
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

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
