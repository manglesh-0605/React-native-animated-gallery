import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CenterContainer = ({ children }) => {
    return (
        <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            {children}
        </SafeAreaView>
    )
}

export default CenterContainer

const styles = StyleSheet.create({})