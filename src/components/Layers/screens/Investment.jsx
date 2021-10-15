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
  ActivityIndicator,
} from 'react-native'
import _ from 'lodash'
import axios from 'axios'
import { makeStyles, useTheme, Button } from 'react-native-elements'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry'
import { Ionicons, Feather } from 'react-native-vector-icons'
import { ScreenHeight } from 'react-native-elements/dist/helpers'
import { connect } from 'react-redux'

import { userSearch, userFollowing, userAddFollow } from '@services/user'
import { nFormatter } from '@utils/functions'

// cons ScreenHeight
const Home = props => {
  const { theme } = useTheme()
  const styles = useStyles(props)
  const [refreshing, setRefreshing] = React.useState(false)
  const [tokenAll, setTokenAll] = useState([])
  const [search, setSearch] = useState('')

  const [tokenMap, setTokenMap] = useState([])
  const [listDivide, setListDivide] = useState([])
  const [current, setCurrent] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    const pairsRes = await axios('https://api.raydium.io/pairs')
    if (pairsRes && pairsRes.data && pairsRes.data.length > 0) {
      const pairs = await pairsRes.data.filter(m => {
        if (
          m.name.includes('USDC') &&
          m.name.toUpperCase().includes('UNKNO') === false &&
          m.pair_id &&
          m.token_amount_coin
        ) {
          return m
        }
      })
      setTokenAll(
        _.uniqBy(
          pairs.sort((a, b) => b.token_amount_coin * b.price - a.token_amount_coin * a.price),
          k => k.pair_id,
        ),
      )
      const divideList = _.chunk(
        _.uniqBy(
          pairs.sort((a, b) => b.token_amount_coin * b.price - a.token_amount_coin * a.price),
          k => k.pair_id,
        ),
        30,
      )

      if (divideList.length > 0) {
        setCurrent(0)
        setListDivide(divideList)
        setTokenMap(divideList[0])
      }
    }
  }
  const addNew = () => {
    if (current < listDivide.length) {
      const current_ = current + 1

      if (listDivide[current_] && listDivide[current_].length > 0) {
        setCurrent(current_)
        const tokenMap_ = tokenMap.concat(listDivide[current_])
        // console.log(tokenMap_.map(m => m.pair_id))
        setTokenMap(tokenMap_)
      }
    }
    setTimeout(() => {
      setAdded(false)
    }, 3000)
  }

  const searching = val => {
    const divideList = _.chunk(
      tokenAll.filter(f => f.name.toUpperCase().includes(val.toUpperCase())),
      30,
    )

    if (divideList.length > 0) {
      setCurrent(0)
      setListDivide(divideList)
      setTokenMap(divideList[0])
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)

    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
  }
  return (
    <View style={{ flex: 1, height: ScreenHeight, backgroundColor: '#fafafa' }}>
      <StatusBar backgroundColor={theme.colors.primary} barStyle={'light-content'} />
      <View style={styles.inputWapper}>
        <TextInput
          placeholder="Search"
          autoCapitalize="none"
          placeholderTextColor={theme.colors.placeholderColor}
          style={styles.inputStyle}
          value={search}
          onChangeText={text => {
            setSearch(text)
            searching(text)
          }}
        />

        <Ionicons name={'search'} color="#000" style={[styles.iconStyleEye]} onPress={() => {}} />
      </View>
      <ScrollView
        style={{}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && added === false) {
            setAdded(true)
            addNew()
            onRefresh()
          }
        }}
        scrollEventThrottle={400}>
        {tokenMap
          .filter(f => f.pair_id && f.name && f.price)
          .map((m, i) => (
            <View
              key={i}
              style={{
                width: '95%',
                borderColor: '#eee',
                borderWidth: 2,
                paddingBottom: 20,
                alignSelf: 'center',
                marginTop: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                  padding: 30,
                }}>
                <View style={{}}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: theme.colors.grey2 }}>
                    {m.name.toUpperCase()}
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: 'green' }}>
                    ${nFormatter(parseFloat(m.price), 5)}
                  </Text>
                </View>

                <View style={{ position: 'absolute', right: 10, flexDirection: 'row' }}>
                  <Button
                    title="SELL"
                    titleStyle={{ fontSize: 13, padding: 6 }}
                    buttonStyle={{ backgroundColor: 'red' }}
                    onPress={() => {
                      alert("Dev team is working on for the mainnet, We'll let you know once ready. Thank you")
                    }}
                  />
                  <Button
                    title="BUY"
                    titleStyle={{ fontSize: 13, padding: 6 }}
                    buttonStyle={{ backgroundColor: 'green', marginHorizontal: 10 }}
                    onPress={() => {
                      alert("Dev team is working on for the mainnet, We'll let you know once ready. Thank you")
                    }}
                  />
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
                  <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>MARKET PAIR </Text>
                  <Text style={{ fontSize: 17, fontWeight: '600' }}>
                    ${nFormatter(m.token_amount_coin * m.price, 2)}
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>VOLUME 24H</Text>
                  <Text style={{ fontSize: 17, fontWeight: '600' }}>${nFormatter(m.volume_24h, 1)}</Text>
                </View>

                <View style={{ paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.grey2 }}>VOLUME 7D</Text>
                  <Text style={{ fontSize: 17, fontWeight: '600' }}>${nFormatter(m.volume_7d, 1)}</Text>
                </View>
              </View>
            </View>
          ))}
      </ScrollView>
      {added && (
        <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 0, zIndex: 1, alignSelf: 'center' }} />
      )}
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
