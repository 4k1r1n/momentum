export type UnsplashData = {
  urls: {
    regular: string;
  };
};

export type FlickrData = {
  photos: {
    photo: Photo[];
  };
};

export type Photo = {
  width_h: number;
  height_h: number;
  url_h: string;
};
