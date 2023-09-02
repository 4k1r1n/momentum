import PhotoSource from '../enums/photo-sources';
import State from '../interfaces/state';

const getImageUrl = (photoSource: State['photoSource'], part: string, number?: string): string => {
  switch (photoSource) {
    case PhotoSource.Unsplash:
      return `https://api.unsplash.com/photos/random?orientation=landscape&query=${part}&client_id=${process.env.UNSPLASH_API_KEY}`;
    case PhotoSource.Flickr:
      return `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${process.env.FLICKR_API_KEY}&tags=${part}&extras=url_l&format=json&nojsoncallback=1&tag_mode=all&sort=relevance&per_page=500&extras=url_h`;
    default:
      return `https://raw.githubusercontent.com/4k1r1n/momentum-backgrounds/main/${part}/${number}.webp`;
  }
};

export default getImageUrl;
