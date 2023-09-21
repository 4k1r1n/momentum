export interface TrackElements {
  audioElement: HTMLMediaElement;
  trackTitleElement: HTMLElement;
  trackArtistElement: HTMLElement;
}

export interface Slider {
  e: MouseEvent;
  sliderElement: HTMLElement;
  audioElement: HTMLMediaElement;
  amountElement: HTMLElement;
}
