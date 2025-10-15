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

export type GameListType = {
  list_id: number;
  title: string;
  description: string;
  creator_id: string;
  creator_username: string;
  creator_profile_img: string;
  nb_likes: number;
  nb_comments: number;
  total_games_count: number;
  games: {
    id: number;
    name: string;
    img: string;
  }[];
};

export type GameListGameType = {
  game_id: number;
  igdb_id: number;
  name: string;
  slug: string;
  image_id: string;
  position: number;
};
