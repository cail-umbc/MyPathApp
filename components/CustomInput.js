import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
//import { TextInput } from "react-native-gesture-handler";

const CustomInput = ({placeholder, secureTextEntry}) => {
    return (
        <View style={styles.container}>
            <TextInput
             placeholder={placeholder}
             style={styles.input}
             secureTextEntry = {secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: "90%",
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginVertical: 5,
    },
    input: {
        fontWeight: 'bold',
        color: 'blue',
    },
});
export default CustomInput;
