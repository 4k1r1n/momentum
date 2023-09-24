import './owfont-regular.css';
import './weather.scss';
import dictionary from '../../../data/dictionary';
import State from '../../../interfaces/state';
import { getLanguage } from '../../../state';
import { OpenWeatherMapData } from '../../../types/api-data';
import createNode from '../../../utils/create-node';

// eslint-disable-next-line prettier/prettier
const getWeatherUrl = (lang: State['language'], city: string): string => `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;

async function getWeatherData(
  language: State['language'],
  value: string,
): Promise<OpenWeatherMapData> {
  const url = getWeatherUrl(language, value);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch weather');
  }
}

const renderError = (language: State['language']): HTMLElement => {
  const error = createNode('p', ['weather__error']);
  error.textContent = `${dictionary[language].weatherError}`;
  return error;
};

const renderInfo = (data: OpenWeatherMapData, language: State['language']): DocumentFragment => {
  const fragment = new DocumentFragment();
  const icon = createNode('i', ['weather__icon', 'owf']);
  const temperature = createNode('p', ['weather__temperature']);
  const description = createNode('p', ['weather__description']);
  const wind = createNode('p', ['weather__wind']);
  const humidity = createNode('p', ['weather__humidity']);
  const { windSpeedUnit } = dictionary[language];
  icon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  wind.textContent = `${dictionary[language].windSpeed}: ${Math.round(
    data.wind.speed,
  )} ${windSpeedUnit}`;
  humidity.textContent = `${dictionary[language].weatherHumidity}: ${Math.round(
    data.main.humidity,
  )}%`;
  description.textContent = data.weather[0].description;
  fragment.append(icon, temperature, description, wind, humidity);
  return fragment;
};

const addAnimation = (element: HTMLElement): void => {
  element.classList.add('fade-in');
  element.addEventListener(
    'animationend',
    () => {
      element.classList.remove('fade-in');
    },
    { once: true },
  );
};

const getWeather = async (
  language: State['language'],
  value: string,
  infoElement: HTMLElement,
): Promise<void> => {
  const data = await getWeatherData(language, value);
  try {
    const info = renderInfo(data, language);
    addAnimation(infoElement);
    infoElement.replaceChildren(info);
  } catch {
    const error = renderError(language);
    addAnimation(infoElement);
    infoElement.replaceChildren(error);
  }
};

const handleInputChange = (
  weatherElement: HTMLElement,
  infoElement: HTMLElement,
  inputElement: HTMLElement,
  language: State['language'],
): void => {
  if (!infoElement.parentElement) {
    weatherElement.append(infoElement);
  }
  if (inputElement instanceof HTMLInputElement) {
    const city = inputElement.value;
    getWeather(language, city, infoElement);
  }
};

const renderWeather = (): HTMLElement => {
  const language = getLanguage();
  const weather = createNode('div', ['header__weather', 'weather']);
  const input = createNode('input', ['weather__city', 'input']);
  const info = createNode('div', ['weather__info']);
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', `${dictionary[language].placeholderCity}`);
  weather.append(input);
  input.addEventListener('change', () => {
    handleInputChange(weather, info, input, language);
  });
  return weather;
};

export default renderWeather;
