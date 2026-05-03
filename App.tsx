import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import auth from "@react-native-firebase/auth";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from "@react-native-async-storage/async-storage";

import HomeScreen from "./Pages/Main_home_screen/homeScreen";
import LoginSignup from "./Pages/Login_signup_screen/loginSignup_page";
import UsersChatPage from "./Pages/User_chat_screen/UsersChatPage";
import StockAgentScreen from "./Pages/Stock_agent_screen/stockAgentPage";
import AgentScreen from "./Pages/Agent_home_screen/agentScreen";
import StockAnalysisExpanded from "./Pages/Stock_agent_screen/User_Stock_Analysis_Expanded/stockAnalysisExpanded";
import WeeklyAnalysisExpanded from "./Pages/Stock_agent_screen/User_Stock_Analysis_Expanded/weeklyAnalysisExpanded";
import OnboardingScreen, { ONBOARDING_KEY } from "./Pages/Onboarding_screen/onboardingScreen";

const Stack = createNativeStackNavigator();

GoogleSignin.configure({
  webClientId: '385628663247-qehttl2jv5gvho54kk0mm9f962a6tj0u.apps.googleusercontent.com',
});

export default function App() {  

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Check if onboarding has been completed
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
      setShowOnboarding(value !== "true");
    });
  }, []);

  // useeffect is used here to handle the user being logged in when the user opens the app , this helps the app to be navigated to the homescreen direcly if a user session is found
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      if (initializing) setInitializing(false);
      console.log(user ? "USER SESSION FOUND FROM app.tsx" : "FAILED TO FIND THE USER SESSION from app.tsx , reason for logout");
    });

    return unsubscribe; 
  }, []);


  // google account auth
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: '385628663247-qehttl2jv5gvho54kk0mm9f962a6tj0u.apps.googleusercontent.com',  
  //   });
  // }, []);

  if (initializing || showOnboarding === null) return null;

  if (user && showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ animation: 'none' }} />
            <Stack.Screen name="UsersChatPage" component={UsersChatPage} />
            <Stack.Screen name="StockAgentScreen" component={StockAgentScreen} options={{ animation: 'none' }}/>
            <Stack.Screen name="StockAnalysisExpanded" component={StockAnalysisExpanded} />
            <Stack.Screen name="WeeklyAnalysisExpanded" component={WeeklyAnalysisExpanded} />
            {/* <Stack.Screen name="AgentScreen" component={AgentScreen}/> */}
            
          </>
        ) : (
          <Stack.Screen name="LoginSignup" component={LoginSignup} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loginSignupDiv: {
    paddingTop: 60,
  },
});
