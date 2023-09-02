import './greeting.scss';
import dictionary from '../../../data/dictionary';
import State from '../../../interfaces/state';
import createNode from '../../../utils/create-node';
import DayParts from '../../../enums/day-parts';
import { getLanguage } from '../../../state';
import getDayPart from '../../../utils/get-day-part';

const showGreeting = (lang: State['language'], greeting: HTMLElement): void => {
  const dayPart = getDayPart();
  const greetingNode = greeting;
  Object.values(DayParts).forEach((part, i) => {
    if (part === dayPart) {
      greetingNode.textContent = `${Object.values(dictionary[lang].greeting)[i]},`;
    }
  });
  setTimeout(() => {
    showGreeting(lang, greetingNode);
  }, 1000);
};

const renderGreeting = (): HTMLElement => {
  const language = getLanguage();
  const wrapper = createNode('div', ['greeting']);
  const greeting = createNode('span', ['greeting__content']);
  const input = createNode('input', ['greeting__name', 'input']);
  input.setAttribute('placeholder', `${dictionary[language].placeholderName}`);
  wrapper.append(greeting, input);
  showGreeting(language, greeting);
  return wrapper;
};

export default renderGreeting;
