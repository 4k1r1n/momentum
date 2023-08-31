import createNode from '../../utils/create-node';

const renderHeader = (): HTMLElement => {
  const header = createNode('header', ['header']);
  const wrapper = createNode('div', ['wrapper']);
  header.append(wrapper);
  return header;
};

export default renderHeader;
