import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { ClinicalTestsProvider } from '../context/ClinicalTestsContext';
import { PreferencesProvider } from '../context/PreferencesContext';

import AuthNavigator from "./AuthNavigator";

export default function AppNavigator(){

    return(

        <SafeAreaProvider>
            <AuthProvider>
                <PreferencesProvider>
                    <ClinicalTestsProvider>
                        <NavigationContainer>
                            <AuthNavigator/>
                        </NavigationContainer>
                    </ClinicalTestsProvider>
                </PreferencesProvider>
            </AuthProvider>
        </SafeAreaProvider>

    )

}
