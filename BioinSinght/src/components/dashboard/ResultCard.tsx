import React from 'react';

import {

StyleSheet,

Text,

View

} from 'react-native';

import { ResultItem } from '../../types/result';

interface Props{

item:ResultItem;

}

const tones={

danger:{

background:'#FDECEC',

icon:'#EF6A6A',

badge:'#FFF1F1',

text:'#EF6A6A'

},

warning:{

background:'#FFF7E6',

icon:'#F3B233',

badge:'#FFF8EA',

text:'#D99A17'

},

success:{

background:'#ECFBF4',

icon:'#4CC38A',

badge:'#ECFBF4',

text:'#2CAF72'

},

neutral:{

background:'#EEF2F7',

icon:'#7F8DA5',

badge:'#EEF2F7',

text:'#65758C'

}

};

export default function ResultCard({

item

}:Props){

const tone=tones[item.tone];

return(

<View style={styles.card}>

<View
style={[
styles.iconContainer,
{
backgroundColor:tone.background
}
]}
>

<Text
style={[
styles.icon,
{
color:tone.icon
}
]}
>

{item.icon}

</Text>

</View>

<View style={styles.info}>

<Text style={styles.name}>

{item.name}

</Text>

<Text style={styles.date}>

{item.date}

</Text>

</View>

<View style={styles.right}>

<Text style={styles.value}>

{item.value}

<Text style={styles.unit}>

 {' '}

{item.unit}

</Text>

</Text>

<View
style={[
styles.badge,
{
backgroundColor:tone.badge
}
]}
>

<Text
style={[
styles.badgeText,
{
color:tone.text
}
]}
>

{item.badge}

</Text>

</View>

</View>

</View>

);

}

const styles=StyleSheet.create({

card:{

backgroundColor:'#FFF',

borderRadius:18,

padding:15,

flexDirection:'row',

alignItems:'center',

marginBottom:14,

shadowColor:'#AAB8D0',

shadowOpacity:.10,

shadowOffset:{
width:0,
height:8
},

shadowRadius:15,

elevation:3

},

iconContainer:{

width:44,

height:44,

borderRadius:14,

justifyContent:'center',

alignItems:'center',

marginRight:14

},

icon:{

fontSize:18,

fontWeight:'800'

},

info:{

flex:1

},

name:{

fontSize:15,

fontWeight:'800',

color:'#26384C'

},

date:{

marginTop:5,

fontSize:12,

color:'#96A3B6'

},

right:{

alignItems:'flex-end'

},

value:{

fontSize:17,

fontWeight:'800',

color:'#233349'

},

unit:{

fontSize:12,

color:'#9AA8BA'

},

badge:{

marginTop:6,

paddingHorizontal:10,

paddingVertical:4,

borderRadius:50

},

badgeText:{

fontSize:11,

fontWeight:'800'

}

});
