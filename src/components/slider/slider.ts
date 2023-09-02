import State from '../../interfaces/state';
import PhotoSource from '../../enums/photo-sources';
import { setSlideNumber, getSlideNumber, getPhotoSource } from '../../state';
import createNode from '../../utils/create-node';
import getDayPart from '../../utils/get-day-part';
import getImageUrl from '../../utils/get-image-url';
import { FlickrData, UnsplashData, Photo } from '../../types/api-data';

const PHOTO_WIDTH = 1600;
const PHOTO_HEIGHT = 1067;

async function getImageData(url: string): Promise<UnsplashData | FlickrData> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch image');
  }
}

function getFilteredPhotos(photos: Photo[]): Photo[] {
  return photos.filter(
    (photo: Photo) => photo.width_h === PHOTO_WIDTH && photo.height_h === PHOTO_HEIGHT,
  );
}

function selectPhotoFromUnsplash(data: UnsplashData): string {
  return data.urls.regular;
}

function selectPhotoFromFlickr(data: FlickrData): string {
  const photos = getFilteredPhotos(data.photos.photo);
  const randomIndex = Math.floor(Math.random() * photos.length);
  return photos[randomIndex].url_h;
}

function selectPhoto(data: UnsplashData | FlickrData, source: State['photoSource']): string {
  switch (source) {
    case PhotoSource.Unsplash:
      if (!('urls' in data)) {
        throw new Error('Invalid Unsplash data');
      }
      return selectPhotoFromUnsplash(data);
    case PhotoSource.Flickr:
      if (!('photos' in data)) {
        throw new Error('Invalid Flickr data');
      }
      return selectPhotoFromFlickr(data);
    default:
      return '';
  }
}

async function getImageSourceFromApi(source: State['photoSource'], url: string): Promise<string> {
  try {
    const data = await getImageData(url);
    return selectPhoto(data, source);
  } catch (error) {
    throw new Error('Failed to get image source from API');
  }
}

async function setBackgroundImage(
  source: State['photoSource'],
  slideNumber: number,
): Promise<void> {
  const backgroundNumber = String(slideNumber).padStart(2, '0');
  const dayPart = getDayPart();
  let imageUrl = getImageUrl(source, dayPart, backgroundNumber);
  try {
    if (source !== PhotoSource.Github) {
      imageUrl = await getImageSourceFromApi(source, imageUrl);
    }
    const img = new Image();
    img.onload = () => {
      document.body.style.backgroundImage = `url(${imageUrl})`;
    };
    img.src = imageUrl;
  } catch (error) {
    throw new Error('Failed to set background image');
  }
}

const getSlideNext = (): void => {
  let slideNumber = getSlideNumber();
  const photoSource = getPhotoSource();
  if (photoSource === PhotoSource.Github) {
    if (slideNumber === 20) {
      slideNumber = 1;
      setSlideNumber(slideNumber);
    } else {
      slideNumber += 1;
      setSlideNumber(slideNumber);
    }
  }
  setBackgroundImage(photoSource, slideNumber);
};

const getSlidePrev = (): void => {
  let slideNumber = getSlideNumber();
  const photoSource = getPhotoSource();
  if (photoSource === PhotoSource.Github) {
    if (slideNumber === 1) {
      slideNumber = 20;
      setSlideNumber(slideNumber);
    } else {
      slideNumber -= 1;
      setSlideNumber(slideNumber);
    }
  }
  setBackgroundImage(photoSource, slideNumber);
};

const renderSliderButtons = (): HTMLElement => {
  const wrapper = createNode('div', ['main__slider-buttons', 'slider-buttons']);
  const prevButton = createNode('button', ['button', 'button_slide-prev']);
  const nextButton = createNode('button', ['button', 'button_slide-next']);
  prevButton.addEventListener('click', getSlidePrev);
  nextButton.addEventListener('click', getSlideNext);
  wrapper.append(prevButton, nextButton);
  return wrapper;
};

export { renderSliderButtons, setBackgroundImage };
