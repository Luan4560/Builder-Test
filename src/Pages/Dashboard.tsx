import React, {useState, useEffect} from 'react';
import {View, Text, StatusBar, Alert, Platform, PermissionsAndroid } from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import {
   Container,
   TextLocation,
   TextTemperature,
   Card,
   ViewInfo,
   TextSubscriptionWeather,
   TextInfo,
   VideoBackground,
   ButtonUpdate,
   ContainerButton
  } from './styles'

import { API_KEY } from '../key';
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
  feelsLike: string;
  statusWeather: number;
}

const Dashboard: React.FC = () => {
  const [location, setLocation] = useState<ILocation | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] =  useState<IVariables| undefined>(undefined);
  const [currentHour, setCurrentHour] = useState('')

  useEffect(() => {
    getLocation()

  }, [])

  useEffect(() => {
    if(location) {
      getWeather()

    }
  },[location])


const getCurrentHour = () => {
  const date = new Date();
  setCurrentHour(date.getHours() + ':' + date.getMinutes())
}

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
      const response = await api.get(`weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=${API_KEY }`)
      const data = response.data;
      const locationWeather = (data.sys.country + '-' + data.name);
      const temperatureMin = convertToCelcius(data.main.temp_min);
      const temporatureMax = convertToCelcius(data.main.temp_max);
      const wind = data.wind.speed;
      const humidity = data.main.humidity;
      const currentTemperatue = convertToCelcius(data.main.temp);
      const feelsLike = convertToCelcius(data.main.feels_like);
      const statusWeather = data.weather.map((item: { id: number; }) => item.id)
      setData({
        locationWeather,
        temperatureMin,
        temporatureMax,
        wind,
        humidity,
        currentTemperatue,
        feelsLike,
        statusWeather,
      })
    getCurrentHour()


    }catch(err) {
      console.log(err, 'An error occurred on getWeather')
    }finally {
      setIsLoading(false)

    }
  }

  const  convertToCelcius = (kelvin: number) => {
    return (kelvin - 273).toFixed(0)
  }

  return (
    <>
    <StatusBar barStyle="light-content" backgroundColor="#312e38"/>
      <Container >
      <VideoBackground source={require('../assets/video.mp4')} />
      <View style={{alignItems : 'center'}}>
        <TextLocation>{data?.locationWeather}</TextLocation>
        <TextLocation>{currentHour}</TextLocation>
        <TextTemperature>{data?.currentTemperatue}ºC</TextTemperature>
      </View>
      <Card>
        <View>
          <ViewInfo>
            <TextSubscriptionWeather>Umidade</TextSubscriptionWeather>
            <TextInfo>{data?.humidity}%</TextInfo>
          </ViewInfo>

          <ViewInfo>
            <TextSubscriptionWeather>Sensação</TextSubscriptionWeather>
            <TextInfo>{data?.feelsLike}º</TextInfo>
          </ViewInfo>
        </View>

        <View>
          <ViewInfo>
            <TextSubscriptionWeather>Temperatura Min.</TextSubscriptionWeather>
            <TextInfo>{data?.temperatureMin}º</TextInfo>
          </ViewInfo>

          <ViewInfo>
            <TextSubscriptionWeather>Temperatura Max.</TextSubscriptionWeather>
            <TextInfo>{data?.temporatureMax}º</TextInfo>
          </ViewInfo>
        </View>
      </Card>


      <ContainerButton style={{width: '100%'}}>
        <ButtonUpdate onPress={() => getWeather()}>
          <Text style={{color: '#fff'}}>Atualizar</Text>
        </ButtonUpdate>
      </ContainerButton>
      </Container>
    </>
  );
};

export default Dashboard;
