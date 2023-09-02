import PhotoSource from '../enums/photo-sources';
import Widgets from './widgets';

export default interface State {
  language: 'en' | 'ru';
  photoSource: PhotoSource;
  activeTrackNum: number;
  audioVolume: number;
  widgets: Widgets;
  slideNumber: number;
}
