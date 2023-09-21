import './audio-player.scss';
import createNode from '../../../utils/create-node';
import playlistData from '../../../data/playlist';
import {
  getActiveTrackNum,
  getAudioVolume,
  setActiveTrackNum,
  setAudioVolume,
} from '../../../state';
import { TrackElements, Slider } from '../../../interfaces/audio-player';

const getTimeCodeFromNum = (number: number): string => {
  const minutes = parseInt(`${number / 60}`, 10);
  const seconds = parseInt(`${number % 60}`, 10);
  return `${minutes}:${String(seconds).padStart(2, '0')} `;
};

const setActiveTrackInPlaylist = (playlistElement: HTMLElement): void => {
  const trackNumber = getActiveTrackNum();
  [...playlistElement.children].forEach((trackItem, i) => {
    if (i === trackNumber) {
      trackItem.classList.add('item_active');
    } else {
      trackItem.classList.remove('item_active');
    }
  });
};

const loadTrack = ({
  audioElement,
  trackTitleElement,
  trackArtistElement,
}: TrackElements): void => {
  const audio = audioElement;
  const trackNumber = getActiveTrackNum();
  const trackTitle = trackTitleElement;
  const trackArtist = trackArtistElement;
  trackTitle.textContent = playlistData[trackNumber].title;
  trackArtist.textContent = playlistData[trackNumber].artist;
  audio.src = playlistData[trackNumber].src;
};

const playAudio = (buttonElement: HTMLElement, audioElement: HTMLMediaElement): void => {
  buttonElement.setAttribute('data-pause', 'false');
  audioElement.play();
};

const handlePlayNextTrack = (
  playlistElement: HTMLElement,
  playButtonElement: HTMLElement,
  { audioElement, trackTitleElement, trackArtistElement }: TrackElements,
): void => {
  let activeTrackNum = getActiveTrackNum();
  activeTrackNum += 1;
  if (activeTrackNum > playlistData.length - 1) {
    activeTrackNum = 0;
  }
  setActiveTrackNum(activeTrackNum);
  loadTrack({ audioElement, trackTitleElement, trackArtistElement });
  setActiveTrackInPlaylist(playlistElement);
  playAudio(playButtonElement, audioElement);
};

const handlePlayPrevTrack = (
  playlistElement: HTMLElement,
  playButtonElement: HTMLElement,
  { audioElement, trackTitleElement, trackArtistElement }: TrackElements,
): void => {
  let activeTrackNum = getActiveTrackNum();
  activeTrackNum -= 1;
  if (activeTrackNum < 0) {
    activeTrackNum = playlistData.length - 1;
  }
  setActiveTrackNum(activeTrackNum);
  loadTrack({ audioElement, trackTitleElement, trackArtistElement });
  setActiveTrackInPlaylist(playlistElement);
  playAudio(playButtonElement, audioElement);
};

const pauseAudio = (buttonElement: HTMLElement, audioElement: HTMLMediaElement): void => {
  buttonElement.setAttribute('data-pause', 'true');
  audioElement.pause();
};

const handlePlayTrack = (playButtonElement: HTMLElement, audio: HTMLMediaElement): void => {
  if (audio.paused) {
    playAudio(playButtonElement, audio);
  } else {
    pauseAudio(playButtonElement, audio);
  }
};

const renderPlaylist = (
  playButtonElement: HTMLElement,
  { audioElement, trackTitleElement, trackArtistElement }: TrackElements,
): Record<string, HTMLElement> => {
  const playlistContainer = createNode('div', ['audio-player__playlist']);
  const playlist = createNode('ul', ['playlist']);
  playlistData.forEach((track, number) => {
    const playlistItem = createNode('li', ['playlist__item', 'item']);
    const container = createNode('div', ['item__container']);
    const name = createNode('span', ['item__title', 'title']);
    const artist = createNode('span', ['item__artist', 'artist']);
    const duration = createNode('span', ['item__duration', 'duration']);
    name.textContent = track.title;
    artist.textContent = track.artist;
    duration.textContent = track.duration;
    container.append(name, artist);
    playlistItem.append(container, duration);
    playlist.append(playlistItem);
    playlistItem.addEventListener('click', () => {
      setActiveTrackNum(number);
      loadTrack({ audioElement, trackTitleElement, trackArtistElement });
      setActiveTrackInPlaylist(playlist);
      handlePlayTrack(playButtonElement, audioElement);
    });
  });
  playlistContainer.append(playlist);
  return { playlistContainer, playlist };
};

const handlePlaylistButtonClick = (
  playlist: HTMLElement,
  audioPlayerElement: HTMLElement,
): void => {
  audioPlayerElement.classList.toggle('expended');
  if (!playlist.parentElement) {
    audioPlayerElement.append(playlist);
    playlist.classList.add('fade-in');
  } else {
    playlist.classList.add('fade-out');
    playlist.addEventListener(
      'animationend',
      () => {
        playlist.remove();
        playlist.classList.remove('fade-out');
      },
      { once: true },
    );
  }
};

const handleTimelineSkip = (
  e: MouseEvent,
  sliderElement: HTMLElement,
  audioElement: HTMLMediaElement,
): void => {
  const audio = audioElement;
  audio.currentTime = (e.offsetX / sliderElement.clientWidth) * audio.duration;
};

const handleVolumeChange = ({ e, sliderElement, audioElement, amountElement }: Slider): void => {
  const amount = amountElement;
  const audio = audioElement;
  const volume = e.offsetX / sliderElement.clientWidth;
  audio.volume = volume;
  amount.style.width = `${volume * 100}%`;
  setAudioVolume(volume);
};

const handleMuteToggle = (
  buttonElement: HTMLElement,
  amountElement: HTMLElement,
  audioElement: HTMLMediaElement,
): void => {
  const audio = audioElement;
  const amount = amountElement;
  audio.muted = !audio.muted;
  if (audio.muted) {
    buttonElement.setAttribute('data-mute', 'true');
    amount.style.width = `${0}`;
  } else {
    const currentVolume = getAudioVolume();
    buttonElement.setAttribute('data-mute', 'false');
    amount.style.width = `${currentVolume * 100}%`;
  }
};

const updateVolume = (
  { e, sliderElement, amountElement, audioElement }: Slider,
  volumeButtonElement: HTMLElement,
): void => {
  const { left, width } = sliderElement.getBoundingClientRect();
  const offsetX = e.pageX - left;
  const volume = Math.max(0, Math.min(1, offsetX / width));
  const amount = amountElement;
  const audio = audioElement;
  amount.style.width = `${volume * 100}%`;
  audio.volume = volume;
  volumeButtonElement.setAttribute('data-mute', volume === 0 ? 'true' : 'false');
};

const updateTrack = ({ e, sliderElement, audioElement, amountElement }: Slider): void => {
  const { left, width } = sliderElement.getBoundingClientRect();
  const offsetX = e.pageX - left;
  const progress = Math.max(0, Math.min(1, offsetX / width));
  const amount = amountElement;
  const audio = audioElement;
  amount.style.width = `${progress * 100}%`;
  if (Number.isFinite(audioElement.duration)) {
    audio.currentTime = audio.duration * progress;
  }
};

// eslint-disable-next-line max-lines-per-function
const renderVolumeControls = (audioElement: HTMLMediaElement): HTMLElement => {
  const volumeContainer = createNode('div', ['controls__volume', 'volume']);
  const volumeButton = createNode('button', ['button', 'button_volume']);
  const sliderElement = createNode('div', ['volume__slider', 'slider']);
  const amountElement = createNode('div', ['volume__amount', 'amount']);
  const currentVolume = getAudioVolume();
  const audio = audioElement;
  volumeButton.dataset.mute = 'false';
  amountElement.style.width = `${currentVolume * 100}%`;
  sliderElement.append(amountElement);
  volumeContainer.append(volumeButton, sliderElement);
  volumeButton.addEventListener('click', () => {
    handleMuteToggle(volumeButton, amountElement, audioElement);
  });
  sliderElement.addEventListener('click', (e: MouseEvent) => {
    handleVolumeChange({ e, sliderElement, audioElement, amountElement });
    if (volumeButton.dataset.mute === 'true') {
      audio.muted = !audio.muted;
      volumeButton.setAttribute('data-mute', 'false');
    }
  });
  audio.addEventListener('loadeddata', () => {
    const defaultVolume = getAudioVolume();
    audio.volume = defaultVolume;
  });
  const handleMouseMove = (e: MouseEvent) => {
    sliderElement.classList.add('slider_hovered');
    updateVolume({ e, sliderElement, amountElement, audioElement }, volumeButton);
  };
  const handleMouseUp = () => {
    sliderElement.classList.remove('slider_hovered');
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
  };
  sliderElement.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
  return volumeContainer;
};

const renderTrackControls = (
  playButtonElement: HTMLElement,
  audioElement: HTMLMediaElement,
): HTMLElement => {
  const sliderElement = createNode('div', ['track-slider', 'slider']);
  const amountElement = createNode('div', ['track-slider__amount', 'amount']);
  sliderElement.append(amountElement);
  audioElement.addEventListener('timeupdate', (e: Event) => {
    if (e.target instanceof HTMLMediaElement) {
      const progressWidth = (e.target.currentTime / e.target.duration) * 100;
      amountElement.style.width = `${progressWidth}%`;
    }
  });
  sliderElement.addEventListener('click', (e: MouseEvent) => {
    handleTimelineSkip(e, sliderElement, audioElement);
  });
  const handleMouseMove = (e: MouseEvent) => {
    updateTrack({ e, sliderElement, audioElement, amountElement });
  };
  const handleMouseUp = () => {
    playAudio(playButtonElement, audioElement);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('mousemove', handleMouseMove);
  };
  sliderElement.addEventListener('mousedown', (e: MouseEvent) => {
    e.preventDefault();
    pauseAudio(playButtonElement, audioElement);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  });
  return sliderElement;
};

// eslint-disable-next-line max-lines-per-function
const renderButtonsControls = (
  audioPlayerElement: HTMLElement,
  playlistContainerElement: HTMLElement,
  playlistElement: HTMLElement,
  playButtonElement: HTMLElement,
  { audioElement, trackTitleElement, trackArtistElement }: TrackElements,
): HTMLElement => {
  const volumeControls = renderVolumeControls(audioElement);
  const playlistButton = createNode('button', ['button', 'button_playlist']);
  const buttons = createNode('div', ['controls__buttons']);
  const buttonsPlay = createNode('div', ['controls__buttons-play']);
  const playPrevButton = createNode('button', ['button', 'button_play-prev']);
  const playNextButton = createNode('button', ['button', 'button_play-next']);
  playButtonElement.setAttribute('data-pause', 'true');
  buttonsPlay.append(playPrevButton, playButtonElement, playNextButton);
  buttons.append(playlistButton, buttonsPlay, volumeControls);
  audioElement.addEventListener('ended', () => {
    handlePlayNextTrack(playlistElement, playButtonElement, {
      audioElement,
      trackTitleElement,
      trackArtistElement,
    });
  });
  playlistButton.addEventListener('click', () => {
    setActiveTrackInPlaylist(playlistElement);
    handlePlaylistButtonClick(playlistContainerElement, audioPlayerElement);
  });
  playButtonElement.addEventListener('click', () => {
    handlePlayTrack(playButtonElement, audioElement);
  });
  playNextButton.addEventListener('click', () => {
    handlePlayNextTrack(playlistElement, playButtonElement, {
      audioElement,
      trackTitleElement,
      trackArtistElement,
    });
  });
  playPrevButton.addEventListener('click', () => {
    handlePlayPrevTrack(playlistElement, playButtonElement, {
      audioElement,
      trackTitleElement,
      trackArtistElement,
    });
  });
  return buttons;
};

const renderControls = (
  playButtonElement: HTMLElement,
  audioElement: HTMLMediaElement,
  buttonsControlsElement: HTMLElement,
): HTMLElement => {
  const trackControls = renderTrackControls(playButtonElement, audioElement);
  const controls = createNode('div', ['audio-player__controls', 'controls']);
  controls.append(trackControls, buttonsControlsElement);
  return controls;
};

const renderTrack = (audioElement: HTMLMediaElement): Record<string, HTMLElement> => {
  const trackContainer = createNode('div', ['audio-player__track', 'track']);
  const info = createNode('div', ['track__info']);
  const trackTitleElement = createNode('span', ['track__title', 'title']);
  const trackArtistElement = createNode('span', ['track__artist', 'artist']);
  const timeContainer = createNode('div', ['track__time']);
  const timer = createNode('span', ['track__timer']);
  const duration = createNode('span', ['track__duration', 'duration']);
  trackContainer.append(info, timeContainer);
  info.append(trackTitleElement, trackArtistElement);
  if (timeContainer instanceof HTMLElement) {
    timeContainer.append(timer, duration);
  }
  loadTrack({ audioElement, trackTitleElement, trackArtistElement });
  audioElement.addEventListener('loadedmetadata', () => {
    timer.textContent = getTimeCodeFromNum(audioElement.currentTime);
    duration.textContent = getTimeCodeFromNum(audioElement.duration);
  });
  audioElement.addEventListener('timeupdate', () => {
    timer.textContent = getTimeCodeFromNum(audioElement.currentTime);
  });
  return { trackContainer, trackTitleElement, trackArtistElement };
};

const renderAudioPlayer = (): HTMLElement => {
  const audioPlayer = createNode('div', ['header__audio-player', 'audio-player']);
  const playButton = createNode('button', ['button', 'button_play']);
  const audioElement = new Audio();
  const trackElements = renderTrack(audioElement);
  const { trackContainer, trackTitleElement, trackArtistElement } = trackElements;
  const { playlistContainer, playlist } = renderPlaylist(playButton, {
    audioElement,
    trackTitleElement,
    trackArtistElement,
  });
  const buttonsControls = renderButtonsControls(
    audioPlayer,
    playlistContainer,
    playlist,
    playButton,
    { audioElement, trackTitleElement, trackArtistElement },
  );
  const controls = renderControls(playButton, audioElement, buttonsControls);
  audioPlayer.append(trackContainer, controls);
  return audioPlayer;
};

export default renderAudioPlayer;
