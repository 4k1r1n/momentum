import './main.scss';
import createNode from '../../utils/create-node';
import renderTime from '../widgets/time/time';

const renderMain = (): HTMLElement => {
  const main = createNode('main', ['main']);
  const wrapper = createNode('div', ['wrapper', 'main__wrapper']);
  const time = renderTime();
  main.append(wrapper);
  wrapper.append(time);
  return main;
};

export default renderMain;
