import './header.scss';
import createNode from '../../utils/create-node';
import renderWeather from '../widgets/weather/weather';

const renderHeader = (): HTMLElement => {
  const header = createNode('header', ['header']);
  const wrapper = createNode('div', ['wrapper', 'header__wrapper']);
  const weather = renderWeather();
  header.append(wrapper);
  wrapper.append(weather);
  return header;
};

export default renderHeader;
