import styled from 'styled-components/native';
import Video from 'react-native-video';
import { Dimensions } from 'react-native';
const { height } = Dimensions.get('window');

export const VideoBackground = styled(Video).attrs((props) => ({
  muted: true,
  repeat: true,
  resizeMode: 'cover',
  rate: 1.0,
  ignoreSilentSwitch: 'obey',
  loop: true,
}))`
  height: ${height}px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  align-items: stretch;
  bottom: 0;
  right: 0;
`;

export const Container = styled.View`
  flex: 1;
  background-color: #312e38;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
`

export const TextLocation = styled.Text `
  color: #fff;
  font-weight: bold;
  font-size: 24px;
  opacity: 0.8;
`

export const TextTemperature = styled.Text`
  color: #fff;
  font-size: 100px;
  opacity: 0.8;
`

export const Card = styled.View`
  background: rgba(68, 157, 209, 0.9);
  opacity: 0.7;
  width: 90%;
  height: 20%;
  border-radius: 15px;
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`
export const ViewInfo = styled.View`
  flex-direction: column;
  align-items: center;
`

export const TextSubscriptionWeather = styled.Text`
  color: #fff;
  opacity: 0.8;
`
export const TextInfo = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`

export const ContainerButton = styled.View`
  align-items: center;
  justify-content: center;
`

export const ButtonUpdate = styled.TouchableOpacity`
  background: rgba(68, 157, 209, 0.9);
  opacity: 0.7;
  width: 90%;
  padding: 15px;
  align-items: center;
  justify-content: center;
  border-radius: 15px;

`
