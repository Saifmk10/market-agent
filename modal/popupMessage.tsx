// popupMessage is a custom build modal that is used to show popup notifications or warning depending on the app situation.
// this is created to bypass the boring Alert.alert that gives a uneditable design which is boring

// the popupMessage makes use of the modal to display the notification in top of any content within the screen. 

// in popupMessage we are making use of 2 props one is message and buttonText ; each are highly customizable as needed for various situations


// there are few changes made in this as i was running a test code here , so in case this is being used again later dont get confused

import React, { useState, useEffect } from "react";
import { Modal, View, Text, Button, TouchableOpacity, StyleSheet, SafeAreaView, StyleProp, ViewStyle, TextInput , ScrollView} from 'react-native';
import colors from "../Assets/colors";


const Popupmessage = ({ message, buttonText1, buttonText2, visible, onClose , stockArray}: { message: any, buttonText1: any, buttonText2: any, visible: any, onClose: any , stockArray:any[]}) => {


    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={modalStyle.mainParent}>
                <View style={modalStyle.parentContainer}>

                    {/* text that holds the message that is being displayed */}
                    <Text style={modalStyle.fontcolor}>{message}</Text>


                    {/* this is the main rea */}
                    <View>
                        <TextInput placeholder="Search Stock Name" style={modalStyle.stockInputSearch}></TextInput>
                    </View>

                    {/*  */}
                    <ScrollView>
                        {stockArray.map((stock, index) => (
                            <View key={index} style={modalStyle.stockNameAndPrice}>
                                <Text style={modalStyle.stockNameAndPrice}>{stock.name}: </Text>
                                <Text style={modalStyle.stockNameAndPrice}>{stock.price}</Text>
                            </View>
                        ))}
                    </ScrollView>


                    {/* button to close the pop up message */}
                    <View style={modalStyle.buttonsPlacement}>
                        <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}>
                            <Text style={modalStyle.buttonText}>{buttonText1}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={modalStyle.buttonDesign} onPress={onClose}>
                            <Text style={modalStyle.buttonText}>{buttonText2}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal >
    );
};


const modalStyle = StyleSheet.create({
    fontcolor: {
        color: colors.primary,
        fontFamily: "Jura-Bold",
        fontSize: 25,

        marginLeft: 10,
        marginRight: 10
    },

    mainParent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },


    parentContainer: {
        //height kept auto here
        height: 600,
        width: 300,
        backgroundColor: colors.secondary,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: colors.gradient_secondary,

        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'center'
    },

    imageDesign: {
        padding: 20
    },

    buttonDesign: {
        backgroundColor: colors.gradient_secondary,
        height: 35,
        width: 90,
        borderRadius: 15,
        margin: 15,

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 2,
        borderColor: colors.primary


    },

    stockInputSearch: {
        margin: 10,
        backgroundColor: "#000000",
        width: 250,
        borderRadius: 20
    },

    stockNameAndPrice: {
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: 2,
        margin: 4,
        borderRadius: 20
    },

    buttonsPlacement: {
        display: "flex",
        flexDirection: "row"
    },

    buttonText: {
        color: colors.secondary,
        fontFamily: "Jura-Bold",
        fontSize: 15,
    },


})

export default Popupmessage;