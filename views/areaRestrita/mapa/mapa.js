import React, { useState, useEffect } from 'react';
import {View, Text} from 'react-native';
import {cssMapa} from './cssMapa';
import MapView, {PROVIDER_GOOGLE, Marker, Callout} from 'react-native-maps';
import config from '../../../config/config';
import mapMarker from '../../../assets/image/pinMarker-2x.png';


export default function Mapa(props){

  const [longitude, setLongitude] = useState([]);
  const [latitude, setLatitude] = useState([]);
  const [local, setLocal] = useState(null);

  function enderecoFormatado(){
    if(local){
      const textFormated = local.split('-');
      return `${textFormated[1] !== undefined ? textFormated[1]:''} ,Nº ${textFormated[0] !== undefined ? textFormated[0]:''} ,${textFormated[2] !== undefined ?textFormated[2]:''}`
    }
  }
  useEffect(() => {
    async function readResp() {
      let response = await fetch(
        config.urlRoot + 'readQrcode',{
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: props.route.params.id
          })
        });
      let json = await response.json();
      setLatitude(json.latitudeQrcode);
      setLongitude(json.longitudeQrcode);
      setLocal(json.localizacaoQrcode);
    };
    readResp();
  }, []);

  
 
  return(

   <View>
   
      <MapView provider={PROVIDER_GOOGLE} style={cssMapa.map} 
          initialRegion={{
            latitude:latitude,
            longitude: longitude,
            latitudeDelta: 0.014757,
            longitudeDelta:0.016866,
        }}
        >
          <Marker 
             icon={mapMarker}
             coordinate={{
               latitude: Number(latitude),
               longitude: Number(longitude),
             }}
           >
           <Callout>
             
             <Text>Meu nome é {props.route.params.nome}</Text>
             <Text>tenho olhos {props.route.params.corOlho}</Text>
             <Text>a cor do meu cabelo é {props.route.params.corCabelo}</Text>
             <Text>meu tom de pele é {props.route.params.corPele}</Text>
             <Text>sou {props.route.params.grauParentesco} do meu responsavel.</Text>
             <Text>Estou no endereço</Text>
             <Text>{enderecoFormatado()}</Text>
           </Callout>
           </Marker>
      </MapView>

   </View>

  );
}
