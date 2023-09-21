import './header.scss';
import createNode from '../../utils/create-node';
import renderWeather from '../widgets/weather/weather';
import renderAudioPlayer from '../widgets/audio-player/audio-player';

const renderHeader = (): HTMLElement => {
  const header = createNode('header', ['header']);
  const wrapper = createNode('div', ['wrapper', 'header__wrapper']);
  const weather = renderWeather();
  const audioPlayer = renderAudioPlayer();
  header.append(wrapper);
  wrapper.append(audioPlayer, weather);
  return header;
};

export default renderHeader;
