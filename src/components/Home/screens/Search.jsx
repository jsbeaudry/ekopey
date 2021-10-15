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
  RefreshControl,
  TextInput,
} from 'react-native'

import { makeStyles, useTheme } from 'react-native-elements'

import { Ionicons, Feather } from 'react-native-vector-icons'
import { ScreenHeight } from 'react-native-elements/dist/helpers'
import { connect } from 'react-redux'
import SendMoney from './SendMoney'

import { userSearch, userFollowing, userAddFollow } from '@services/user'

// cons ScreenHeight
const Home = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)

  const [modalDetails, setModalDetails] = useState(false)

  const [username, setUsername] = useState(null)

  const [refreshing, setRefreshing] = React.useState(false)
  const [followers, setFollwers] = React.useState([])
  const [list, setList] = React.useState([])

  useEffect(() => {
    getFollowing()
  }, [])
  const getUsers = data => {
    userSearch(data, props.user.token)
      .then(resp => {
        if (resp && resp.data && resp.data.length > 0) {
          setList(resp.data)
        }
      })
      .catch(erre => {
        console.log(erre)
      })
  }

  const getFollowing = () => {
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
  const onRefresh = React.useCallback(() => {
    setRefreshing(true)

    getFollowing()

    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  return (
    <View style={{ flex: 1, height: ScreenHeight, backgroundColor: '#fafafa' }}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />
      <View style={styles.inputWapper}>
        <TextInput
          placeholder="Receiver"
          autoCapitalize="none"
          placeholderTextColor={theme.colors.placeholderColor}
          style={styles.inputStyle}
          // value={username}
          onChangeText={text => {
            if (text.length > 0) {
              getUsers(text)
            } else {
              setList([])
            }
          }}
        />

        <Ionicons name={'search'} color="#000" style={[styles.iconStyleEye]} onPress={() => {}} />
      </View>
      <ScrollView style={{}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {list && list.length > 0 && props.user && props.user.user && props.user.user.id ? (
          <View style={{ marginTop: 0 }}>
            {list
              .filter(f => f.id !== props.user.user.id)
              .filter(f => followers.filter(k => k.user.id === f.id).length === 0)
              .map((m, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,

                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setUsername(m.username)
                      setModalDetails(true)
                    }}
                    style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <Image
                      source={require('@assets/images/Defaultlt_User_Avatar.png')}
                      resizeMode="cover"
                      style={{ width: 40, height: 40, borderRadius: 10 }}
                    />
                    <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                      <Text style={{ fontSize: 17, color: '#555' }}>{m.username}</Text>
                      <Text style={{ fontSize: 12, color: '#888' }}>Since: {new Date(m.createdAt).toDateString()}</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        Alert.alert(
                          'Accept demand',
                          `Do you really want follow  @${m.username}?`,
                          [
                            {
                              text: 'No',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'Yes',
                              onPress: async () => {
                                const followUID = props.user.user.id + '-' + m.id
                                userAddFollow(
                                  {
                                    follower: props.user.user.id,
                                    user: m.id,
                                    followUID: followUID,
                                    status: 'ACCEPTED',
                                  },
                                  props.user.token,
                                ).then(resp => {
                                  getFollowing()
                                })
                              },
                            },
                          ],
                          { cancelable: false },
                        )
                      }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: 'purple' }}>{'Follow'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
          </View>
        ) : null}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDetails}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
        }}>
        <TouchableOpacity
          style={{ position: 'absolute', padding: 10, right: 10, top: 30, zIndex: 99, padding: 20 }}
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
    fontSize: 13,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  inputWapper: {
    marginTop: 10,
    alignSelf: 'center',
    width: '85%',
    height: 40,
    backgroundColor: '#f3f3f3',
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

const mapStateToProps = state => ({
  logged: state.user.logged,
  user: state.user.user,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
