import PhotoSource from './enums/photo-sources';
import State from './interfaces/state';
import getRandomNumber from './utils/get-random-number';

export const state: State = {
  language: 'en',
  photoSource: PhotoSource.Github,
  activeTrackNum: 0,
  audioVolume: 0.75,
  slideNumber: getRandomNumber(),
  widgets: {
    time: true,
    date: true,
    greeting: true,
    quote: true,
    weather: true,
    audio: true,
    todoList: true,
  },
};
export const setSlideNumber = (value: State['slideNumber']): void => {
  state.slideNumber = value;
};
export const setLanguage = (value: State['language']): void => {
  state.language = value;
};
export const setActiveTrackNum = (value: State['activeTrackNum']): void => {
  state.activeTrackNum = value;
};
export const setAudioVolume = (value: State['audioVolume']): void => {
  state.audioVolume = value;
};
export const getLanguage = (): State['language'] => state.language;
export const getSlideNumber = (): State['slideNumber'] => state.slideNumber;
export const getPhotoSource = (): State['photoSource'] => state.photoSource;
export const getActiveTrackNum = (): State['activeTrackNum'] => state.activeTrackNum;
export const getAudioVolume = (): State['audioVolume'] => state.audioVolume;
