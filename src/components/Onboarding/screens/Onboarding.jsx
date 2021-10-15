import React, { useState, useRef } from 'react'
import { View, Image, ImageBackground, Text, TouchableOpacity } from 'react-native'
import { useTheme, makeStyles } from 'react-native-elements'
import Swiper from 'react-native-web-swiper'

const bgImages = ['#000', '#111', '#111000']

const title = {
  0: 'Create your wallet',
  1: 'Friendly and easy to use',
  2: 'Invite your friends',
}

const ullistra = [
  require('@assets/images/im2.png'),
  require('@assets/images/im3.png'),
  require('@assets/images/im1.png'),
]
const subtitle = {
  0: ['Stay connect with your friends and family by sending money faster', ''],
  1: ['Start send money like sending  sms with a blockchain secure platform', ''],
  2: ['Create your list to stay connect with close people every day', ''],
}
const Onboarding = ({ navigation }) => {
  const { theme } = useTheme()
  const styles = useStyles()

  const [background, setBackground] = useState(0)
  const swipeRef = useRef(null)

  return (
    <View style={[styles.container]}>
      <ImageBackground
        style={styles.container}
        source={{ uri: 'https://i.pinimg.com/736x/77/6b/64/776b64b764b509f427addaf8ae5ac992.jpg' }}>
        <Image
          source={ullistra[background]}
          style={{ width: 250, height: 300, marginTop: 100, resizeMode: 'contain', alignSelf: 'center' }}
        />
        <Swiper
          ref={swipeRef}
          containerStyle={{}}
          from={background}
          springConfig={{ speed: 11 }}
          minDistanceForAction={0.15}
          onIndexChanged={i => {
            setBackground(i)
          }}
          controlsProps={{
            dotsTouchable: true,
            prevPos: 'left',
            nextPos: 'right',
            nextTitle: '',
            prevTitle: '',
            DotComponent: ({ isActive }) => (
              <View
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: isActive ? theme.colors.grey2 : theme.colors.white,
                  borderRadius: 4,
                  marginTop: 0,
                  marginLeft: 8,
                  marginRight: 8,
                  marginBottom: 30,
                }}
              />
            ),
          }}>
          {bgImages.map((m, i) => {
            return (
              <View key={i} style={styles.contentContainer}>
                <Text style={styles.title}>{title[i]}</Text>
                <Text style={styles.subtitle}>
                  {subtitle[i][0]}{' '}
                  <Text style={{ fontFamily: theme.fontFamily.MontserratSemiBold }}>{subtitle[i][1]}</Text>
                </Text>
              </View>
            )
          })}
        </Swiper>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (background !== 2) {
              swipeRef.current.goToNext()
            } else {
              navigation.navigate('Inicial')
            }
          }}>
          <Text style={styles.nextTitle}>{background === 2 ? 'Get started' : 'Next'}</Text>
        </TouchableOpacity>

        {/* {background !== 2 ? (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              navigation.navigate('LogIn')
            }}>
            <Text style={styles.nextTitle}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipButton} />
        )} */}
      </ImageBackground>
    </View>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    width: '100%',
  },

  background: {
    flex: 1,
    width: '100%',
  },

  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },

  title: {
    textAlign: 'center',
    color: theme.colors.white,
    fontSize: 20,
    fontFamily: theme.fontFamily.PoppinsBold,
  },

  subtitle: {
    maxWidth: 250,
    marginTop: 10,
    textAlign: 'center',
    color: theme.colors.white,
    fontFamily: theme.fontFamily.MontserratMedium,
    fontSize: 15,
    lineHeight: 20,
  },

  nextButton: {
    height: 40,
    width: 200,
    borderRadius: 5,
    marginBottom: 80,
    backgroundColor: theme.colors.white,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'MontserratMedium',
  },

  nextTitle: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: theme.colors.black,
    fontFamily: theme.fontFamily.MontserratSemiBold,
    fontSize: 15,
  },

  skipButton: {
    marginVertical: 30,
  },
}))

export default Onboarding
