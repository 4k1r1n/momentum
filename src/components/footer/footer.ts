import './footer.scss';
import createNode from '../../utils/create-node';
import renderQuote from '../widgets/quote/quote';

const renderFooter = (): HTMLElement => {
  const footer = createNode('footer', ['footer']);
  const wrapper = createNode('div', ['wrapper', 'footer__wrapper']);
  const options = createNode('div', ['footer__options', 'options']);
  const copyright = createNode('div', ['footer__copyright', 'copyright']);
  const year = createNode('span', ['copyright__year'], '© 2022');
  const github = createNode('a', ['link', 'link_github']);
  const rs = createNode('a', ['link', 'link_rs']);
  github.setAttribute('target', '_blank');
  github.setAttribute('href', 'https://github.com/4k1r1n');
  rs.setAttribute('target', '_blank');
  rs.setAttribute('href', 'https://rs.school/js/');
  const quote = renderQuote();
  footer.append(wrapper);
  copyright.append(year, github, rs);
  wrapper.append(quote, options, copyright);
  return footer;
};

export default renderFooter;
