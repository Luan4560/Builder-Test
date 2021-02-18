import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar, TouchableOpacity, Alert, Permission, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import img from '../assets/bg.png'
import { API_KEY } from '../key';
import {Container,TextLocation, TextTemperature, TextStatus  } from './styles'

import api from '../services/api';

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IVariables {
  locationWeather: string;
  temperatureMin: string;
  temporatureMax: string;
  wind: string;
  humidity: string;
  currentTemperatue: string;

}

const Dashboard: React.FC = () => {
  const [temperature, setTemperature] = useState('25')
  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] =  useState<IVariables| undefined>(undefined);
  const [currentHour, setCurrentHour] = useState('')
  console.log(location)
  useEffect(() => {
    getLocation()
    getWeather()
  }, [])


  const getLocation = async() => {
    if(Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse')
      if(auth === 'granted' ) {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLocation({
              latitude,
              longitude,
            });

          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );

      }
    }
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if ('granted' === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setLocation({
              latitude,
              longitude,
            });

          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );

      }
    }

  }



  const getWeather = async() => {
    try {
      setIsLoading(true)

      const response = await api.get(`weather?lat=${location?.latitude}lon=${location?.longitude}&appid=58c3c67c5d5bba54113f9217bfce3fe3`)
      const data = response.data;
      const locationWeather = (data.sys.country + '-' + data.name);
      const temperatureMin = convertToCelcius(data.main.temp_min);
      const temporatureMax = convertToCelcius(data.main.temp_max);
      const wind = data.wind.speed;
      const humidity = data.humidity;
      const currentTemperatue = convertToCelcius(data.main.temp);

      setData({
        locationWeather,
        temperatureMin,
        temporatureMax,
        wind,
        humidity,
        currentTemperatue
      })
    }catch(err) {
      console.log(err.response, 'An error occurred on getWeather')
    }finally {
      setIsLoading(false)
    }
  }

  const  convertToCelcius = (kelvin: number) => {
    return (kelvin - 273).toFixed(0)
  }

  return (
    <>
    <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <Container source={img}>
        <View>
          <TextLocation>{data?.locationWeather}</TextLocation>
          <TextLocation>{currentHour}</TextLocation>
        </View>

        <View style={{alignItems : 'center'}}>
          <TextTemperature>{data?.currentTemperatue}ºC</TextTemperature>
          <TextStatus>Chuva</TextStatus>
        </View>

        <View>
          <TouchableOpacity onPress={() => getWeather()}>
            <Text>Atualizar</Text>
          </TouchableOpacity>
        </View>
      </Container>
    </>
  );
};

export default Dashboard;
