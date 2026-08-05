import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    type TextInputProps,
} from 'react-native';

interface Props{

    label:string;

    value:string;

    placeholder:string;

    secureTextEntry?:boolean;

    onChangeText:(text:string)=>void;

    autoCapitalize?: TextInputProps['autoCapitalize'];

    keyboardType?: TextInputProps['keyboardType'];

    textContentType?: TextInputProps['textContentType'];

}

export default function Input({

    label,

    value,

    placeholder,

    secureTextEntry,

    onChangeText,

    autoCapitalize,

    keyboardType,

    textContentType,

}:Props){

    return(

        <View style={styles.container}>

            <Text style={styles.label}>
                {label}
            </Text>

            <TextInput

                style={styles.input}

                value={value}

                placeholder={placeholder}

                placeholderTextColor="#B8C0CF"

                secureTextEntry={secureTextEntry}

                autoCapitalize={autoCapitalize}

                keyboardType={keyboardType}

                textContentType={textContentType}

                onChangeText={onChangeText}

            />

        </View>

    );

}

const styles=StyleSheet.create({

container:{
marginBottom:16
},

label:{
marginBottom:8,
fontSize:14,
fontWeight:'700',
color:'#4C5D78'
},

input:{
height:50,
borderWidth:1,
borderColor:'#DFE5EE',
borderRadius:14,
paddingHorizontal:16,
backgroundColor:'#FFF',
fontSize:15,
color:'#223046'
}

});
