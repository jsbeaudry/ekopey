import { initStripe } from '@stripe/stripe-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native'
import { STRIPE_KEY } from '@env'

const PaymentScreen = ({ children }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initialize() {
      const publishableKey = STRIPE_KEY
      if (publishableKey) {
        await initStripe({
          publishableKey,
          merchantIdentifier: 'merchant.com.stripe.react.native',
          urlScheme: 'stripe-example',
          setUrlSchemeOnAndroid: true,
        })
        setLoading(false)
      }
    }
    initialize()
  }, [])

  return loading ? (
    <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
  ) : (
    <ScrollView accessibilityLabel="payment-screen" style={styles.container} keyboardShouldPersistTaps="handled">
      {children}
      <Text style={{ opacity: 0 }}>appium fix</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
})

export default PaymentScreen
