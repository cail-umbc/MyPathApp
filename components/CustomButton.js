import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const CustomButton = ({ onPress, text, type = "PRIMARY" }) => {
    return (
        <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            <Text style={[styles.text, styles[`text_${type}`],]}>{text}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15, 
        marginVertical: 5,
        alignItems: 'center',
    },
    container_PRIMARY: {
        width: "30%",
        backgroundColor: '#FFFFFF',
    },
    container_SECONDARY: {
        width: "50%",
        backgroundColor: '#01BCAD',
    },
    container_TERTIARY: {
        width: "50%",
    },
    text: {
        fontWeight: 'bold',
        color: 'white',
    },

    text_TERTIARY: {
        color: 'blue',
        borderBottomColor: 'blue',
        borderBottomWidth: 1,
    },
});
export default CustomButton;
