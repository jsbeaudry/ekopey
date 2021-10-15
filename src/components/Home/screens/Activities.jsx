import React, { useState, useEffect } from 'react'
import {
  View,
  StatusBar,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TouchableHighlight,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Linking,
} from 'react-native'
import { makeStyles, useTheme, Header } from 'react-native-elements'

import { RFValue } from 'react-native-responsive-fontsize'

import { Feather } from 'react-native-vector-icons'
import { ScreenHeight } from 'react-native-elements/dist/helpers'
import { connect } from 'react-redux'
import { userGetTx } from '@services/user'
import { NETWORK } from '@env'

const logo = require('@assets/images/logo-white.png')
const techImage = require('@assets/images/techimage.jpg')

// cons ScreenHeight
const Home = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [modalDetails, setModalDetails] = useState(false)
  const [refreshing, setRefreshing] = React.useState(false)
  const [accountTransactions, setAccountTransactions] = useState([])
  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    allTransactions()
  }, [])

  const allTransactions = () => {
    if (props.user && props.user.user && props.user.user.id) {
      userGetTx(props.user.user.id, props.user.token).then(myTransactions => {
        if (myTransactions && myTransactions.data) {
          setAccountTransactions(myTransactions.data)
        }
      })
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)

    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  return (
    <View style={{ flex: 1, height: ScreenHeight, backgroundColor: '#fafafa' }}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />

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
      {accountTransactions && accountTransactions.length === 0 && (
        <View>
          <Text
            style={{ alignSelf: 'center', fontSize: 20, fontWeight: '900', marginTop: 100, color: theme.colors.grey2 }}>
            OUPP'S
          </Text>
          <Text style={{ alignSelf: 'center', marginTop: 10, color: theme.colors.grey2 }}>
            No transactions found for your wallet
          </Text>
        </View>
      )}

      <ScrollView style={{}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {accountTransactions && accountTransactions.length > 0 && (
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
                            : 'red',
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
                  <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: '900' }}>{transaction.amount}</Text>
                  <Text
                    style={{
                      fontSize: 15,
                      alignSelf: 'center',
                      fontWeight: '600',
                      color: transaction.sender.id === props.user.user.id ? 'red' : 'green',
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
    </View>
  )
}

const useStyles = makeStyles((theme, props) => ({
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
    fontSize: RFValue(13),
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
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
