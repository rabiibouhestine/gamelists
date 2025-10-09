export type CoverType = {
  id: string;
  image_id: string;
};

export type GameCoverType = {
  id: number;
  name: string;
  cover: CoverType;
  slug: string;
};

export type InvolvedCompany = {
  id: number;
  developer?: boolean;
  company?: {
    id?: string | number;
    name?: string;
  };
};
