import './quote.scss';
import Quote from '../../../interfaces/quote';
import State from '../../../interfaces/state';
import { getLanguage } from '../../../state';
import createNode from '../../../utils/create-node';

const getQuoteUrl = (language: State['language']): string => `./data/quotes/data-${language}.json`;

async function getQuotesData(language: State['language']): Promise<Quote[]> {
  const url = getQuoteUrl(language);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch quote');
  }
}

async function setQuote(quoteNode: HTMLElement, authorNode: HTMLElement): Promise<void> {
  const quote = quoteNode;
  const author = authorNode;
  const language = getLanguage();
  const data = await getQuotesData(language);
  const randomQuoteIndex = Math.floor(Math.random() * data.length);
  if (data[randomQuoteIndex].author === null) {
    author.textContent = '';
  } else {
    author.textContent = `${data[randomQuoteIndex].author}`;
  }
  quote.textContent = `"${data[randomQuoteIndex].text}"`;
}

const renderQuote = (): HTMLElement => {
  const wrapper = createNode('div', ['footer__quote', 'quote']);
  const button = createNode('button', ['button', 'button_quote']);
  const quote = createNode('p', ['quote__content']);
  const author = createNode('p', ['quote__author']);
  button.addEventListener('click', () => setQuote(quote, author));
  setQuote(quote, author);
  wrapper.append(button, quote, author);
  return wrapper;
};

export default renderQuote;
