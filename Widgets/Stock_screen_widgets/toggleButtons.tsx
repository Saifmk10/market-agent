// this widget is the top widget , the toggle button that is used to switch from the chat to stocks

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import colors from "../../Assets/colors";

// helps in checking if the user has clicked in the login or on the signin (login == true , signin == false) 







const ToggleButton = ({ checker, setCheckerTo }: { checker: any, setCheckerTo: any }) => {

    // const [checker , setCheckerTo] = useState(true)

//     const onclickUiChange = () =>{
//     if(checker == true){
    
//     }
// }

    return (
        <View style={loginSignupStyle.loginToggleDiv}>
            <TouchableOpacity onPress={() => setCheckerTo("DASHBOARD")}>
                <Text style={checker === "DASHBOARD" ? loginSignupStyle.loginToggleButtonsHover : loginSignupStyle.loginToggleButtonsNoHover}>DASHBOARD</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCheckerTo("STOCKS")}>
                <Text style={checker === "STOCKS" ? loginSignupStyle.loginToggleButtonsHover : loginSignupStyle.loginToggleButtonsNoHover}>STOCKS</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCheckerTo("BOT")}>
                <Text style={checker === "BOT"  ? loginSignupStyle.loginToggleButtonsHover : loginSignupStyle.loginToggleButtonsNoHover}>LEARNING</Text>
            </TouchableOpacity>
        </View>


        
    )
}






const loginSignupStyle = StyleSheet.create({


    // holds the login toggle design for the buttons
    loginToggleDiv: {
        backgroundColor: colors.secondary,
        height: 45,
        width: 350,
        borderRadius: 10,
        flexDirection: 'row',
        padding : 8
    },

    // holds the design for the login and signup button design , when button is pressed this design is applied
    loginToggleButtonsHover: {

        backgroundColor: colors.gradient_secondary,
        alignItems: 'center',
        flex : 1,
        justifyContent : 'center',
        // margin: 8,
        // marginLeft: 1,
        borderRadius: 10,
        borderColor: colors.primary,
        borderWidth: 2,

        width: 130,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: colors.secondary,
        fontFamily: 'Jura-Bold',
        fontSize: 12,
        letterSpacing: 1,
    },

    // when the button is not hover this design is applied
    loginToggleButtonsNoHover: {
        backgroundColor: colors.secondary,
        alignItems: 'center',
        flex : 1,
        justifyContent : 'center',
        // margin: 8,
        borderRadius: 10,

        width: 100,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: colors.primary,
        fontFamily: 'Jura-Bold',
        fontSize: 12,
        letterSpacing: 1,
    },


})

export default ToggleButton; 