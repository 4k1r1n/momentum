import './time.scss';
import State from '../../../interfaces/state';
import { getLanguage } from '../../../state';
import createNode from '../../../utils/create-node';

const showDate = (node: HTMLElement, language: State['language'], date: Date): void => {
  const dateNode = node;
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };
  dateNode.textContent = date.toLocaleDateString(language, options);
};

const showTime = (
  timeNode: HTMLElement,
  dateNode: HTMLElement,
  language: State['language'],
): void => {
  const date = new Date();
  const timeElement = timeNode;
  const dateElement = dateNode;
  const currentTime = date.toLocaleTimeString(language);
  timeElement.textContent = `${currentTime}`;
  showDate(dateElement, language, date);
  setTimeout(() => {
    showTime(timeElement, dateElement, language);
  }, 1000);
};

const renderTime = (): DocumentFragment => {
  const language = getLanguage();
  const time = createNode('time', ['time']);
  const date = createNode('time', ['main__date', 'date']);
  const fragment = document.createDocumentFragment();
  fragment.append(time, date);
  showTime(time, date, language);
  return fragment;
};

export default renderTime;
