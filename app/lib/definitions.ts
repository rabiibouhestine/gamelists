export type CoverType = {
  id: string;
  image_id: string;
};

export type GameCoverType = {
  id: number;
  name: string;
  cover: CoverType;
};
