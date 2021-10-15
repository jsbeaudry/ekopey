import React, { useState, useEffect } from 'react'
import { View, StatusBar, Alert, Image, Text, TouchableOpacity, Modal, ScrollView, RefreshControl } from 'react-native'

import { makeStyles, useTheme } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { RFValue } from 'react-native-responsive-fontsize'

import { Feather } from 'react-native-vector-icons'
import { ScreenHeight } from 'react-native-elements/dist/helpers'
import { connect } from 'react-redux'
import SendMoney from './SendMoney'

import { userFollowing, userDeleteFollow } from '@services/user'

// cons ScreenHeight
const Home = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [modalDetails, setModalDetails] = useState(false)
  const [username, setUsername] = useState(null)

  const [refreshing, setRefreshing] = React.useState(false)
  const [followers, setFollwers] = React.useState([])

  useEffect(() => {
    getFollowers()
  }, [])
  const getFollowers = () => {
    if (props.user && props.user.user) {
      userFollowing(props.user.user.id, props.user.token)
        .then(resp => {
          if (resp && resp.data && resp.data.length > 0) {
            setFollwers(resp.data)
          } else {
            setFollwers([])
          }
        })
        .catch(erre => {
          console.log(erre)
        })
    }
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    getFollowers()
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  return (
    <View style={{ flex: 1, height: ScreenHeight, backgroundColor: '#fafafa' }}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />

      <ScrollView style={{}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {followers && followers.length === 0 && (
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
              No friends found for your list
            </Text>
          </View>
        )}
        <View style={{ marginTop: 30 }}>
          {followers.map((m, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                paddingVertical: 10,
                paddingHorizontal: 20,
                justifyContent: 'space-between',
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setUsername(m.user.username)
                  setModalDetails(true)
                }}
                style={{ flexDirection: 'row' }}>
                <Image
                  source={require('@assets/images/Defaultlt_User_Avatar.png')}
                  resizeMode="cover"
                  style={{ width: 40, height: 40, borderRadius: 10 }}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontSize: 17, color: '#555' }}>{m.user.username}</Text>
                  <Text style={{ fontSize: 12, color: '#888' }}>Since: {new Date(m.createdAt).toDateString()}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Remove',
                    `Do you really want remove  @${m.user.username}?`,
                    [
                      {
                        text: 'No',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: async () => {
                          userDeleteFollow(m.id, props.user.token).then(resp => {
                            getFollowers()
                          })
                        },
                      },
                    ],
                    { cancelable: false },
                  )
                }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: 'purple' }}>{'Remove'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDetails}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <TouchableOpacity
          style={{ position: 'absolute', padding: 10, right: 13, top: 84, zIndex: 99, padding: 20 }}
          onPress={() => {
            setModalDetails(false)
          }}>
          <Feather
            name={'x'}
            style={[
              {
                fontSize: 30,
                color: 'red',
              },
            ]}
          />
        </TouchableOpacity>
        <SendMoney
          username={username}
          onClose={() => {
            setModalDetails(false)
          }}
          onReload={() => {}}
        />
      </Modal>
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
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
