import React,{useState,useEffect} from 'react';
import {View,Text,StyleSheet,Image,TextInput,TouchableOpacity} from 'react-native'
import MapView,{Marker,Callout} from 'react-native-maps'
import {requestPermissionsAsync,getCurrentPositionAsync} from 'expo-location'
import {MaterialIcons} from '@expo/vector-icons'
import api from '../Services/api';
import {connect,disconnect} from '../Services/socket';
export default function Main({navigation}) {
  const [devs,SetDevs] = useState([])
  const [ currentRegion , setCurrentRegion] = useState(null);
  const [techs,setTechs] = useState('');
  useEffect(()=>{
    async function loadInitialPosition(){
     const {granted} =  await requestPermissionsAsync();
     if (granted) {
       const {coords} =  await getCurrentPositionAsync({
        enableHighAccuracy:true
       });
       const {latitude,longitude} = coords;
       setCurrentRegion({
         latitude,
         longitude,
         latitudeDelta:0.04,
         longitudeDelta:0.04,
       })
     }
    }
    loadInitialPosition();
  },[])
  if (!currentRegion) {
    return null;
  }
  function setupWebSocket(){
    const {latitude,longitude} = currentRegion;
    connect(
      latitude,longitude,techs
    );
  }
  async function Load(){
    const {latitude,longitude} = currentRegion;
    const response = await api.get('/search',{
      params:{
        longitude,
        latitude,
        techs,
       
      }
    })
    
    SetDevs(response.data.devs);
    setupWebSocket();
  }
  function HandleRegionChange(region){
   
    setCurrentRegion(region);
  }
  
  return (
    <>
    <MapView onRegionChangeComplete={HandleRegionChange} initialRegion={currentRegion} style={styles.map} >
     {devs?.map(dev=>(
        <Marker key={dev._id} coordinate={{latitude:dev.location.coordinates[1],
        longitude:dev.location.coordinates[0]}} >
        <Image source={{uri:dev.avatar_url}} 
          style={styles.avatar}
        />
        <Callout onPress={()=>{
          navigation.navigate('Profile',{github_username:dev.github_username})
        }}>
          <View  style={styles.callout}>
                <Text style={styles.name}>{dev.name}</Text>
                <Text style={styles.bio}>{dev.bio}</Text>
                <Text style={styles.techs} >{dev.techs.join(', ')}</Text>
          </View>
        </Callout>
    </Marker>
     ))}
    </MapView>
    <View style={styles.form}>
          <TextInput 
            style={styles.input}
            placeholder='Buscar devs'
            placeholderTextColor='#999'
            autoCapitalize="words"
            autoCorrect={false}
            value={techs}
            onChangeText={setTechs}
          />
          <TouchableOpacity onPress={()=>Load()} style={styles.btn} >
           <MaterialIcons name='my-location' size={20} color="#fff" />
          </TouchableOpacity>
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  map:{
    flex:1
  },
  avatar:{
    width:54,
    height:54,
    borderRadius:4,
    borderWidth:4,
    borderColor:'#7d40e7'
  },
  callout:{
    width:230
   
  },
  name:{
    fontWeight:'bold',
    fontSize:16
  },
  bio:{
    color:'#666',
    marginTop:5,
  },
  techs:{
    marginTop:5
  },
  form:{
    position:'absolute',
    top:20,
    left:20,
    right:20,
    zIndex:5,
    flexDirection:'row'
  },
  input:{
    flex:1,
    height:50,
    backgroundColor:'#fff',
    color:'#333',
    borderRadius:25,
    paddingHorizontal:20,
    fontSize:16,
    shadowColor:'#000',
    shadowOffset:{
      width:4,
      height:4
    },
    shadowOpacity:0.2,
    elevation:5
  },
  btn:{
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:'#8e4dff',
    justifyContent:'center',
    alignItems:'center',
    marginLeft:10
  }
})
