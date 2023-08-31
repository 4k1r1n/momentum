import './main.scss';
import createNode from '../../utils/create-node';

const renderMain = (): HTMLElement => {
  const main = createNode('main', ['main']);
  const wrapper = createNode('div', ['wrapper', 'main__wrapper']);
  main.append(wrapper);
  return main;
};

export default renderMain;
