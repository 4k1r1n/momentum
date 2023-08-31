import './style.scss';
import renderHeader from './components/header/header';
import createNode from './utils/create-node';
import renderMain from './components/main/main';
import renderFooter from './components/footer/footer';

const renderApp = (root: HTMLElement): void => {
  const app = createNode();
  app.setAttribute('id', 'app');
  const header = renderHeader();
  const main = renderMain();
  const footer = renderFooter();
  root.append(app);
  app.append(header, main, footer);
};

renderApp(document.body);
