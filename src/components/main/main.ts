import './main.scss';
import createNode from '../../utils/create-node';
import renderTime from '../widgets/time/time';
import renderGreeting from '../widgets/greeting/greeting';
import { renderSliderButtons, setBackgroundImage } from '../slider/slider';
import { getPhotoSource, getSlideNumber } from '../../state';

const renderMain = (): HTMLElement => {
  const slideNumber = getSlideNumber();
  const photoSource = getPhotoSource();
  const main = createNode('main', ['main']);
  const wrapper = createNode('div', ['wrapper', 'main__wrapper']);
  const sliderButtons = renderSliderButtons();
  const time = renderTime();
  const greeting = renderGreeting();
  main.append(wrapper);
  wrapper.append(sliderButtons, time, greeting);
  setBackgroundImage(photoSource, slideNumber);
  return main;
};

export default renderMain;
