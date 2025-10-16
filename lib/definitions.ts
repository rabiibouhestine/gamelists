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
  is_public: boolean;
  is_ranked: boolean;
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
  first_release_date: number;
  position: number;
};

export type IGDBGameType = {
  id: number;
  cover: {
    id: number;
    image_id: string;
  };
  name: string;
  slug: string;
  first_release_date: number;
};

export type GameType = {
  igdb_id: number;
  image_id: string;
  name: string;
  slug: string;
  first_release_date: number;
};

export type ListFormValidationErrorsType = {
  errors: string[];
  properties?: {
    name?: { errors: string[] };
    is_public?: { errors: string[] };
    is_ranked?: { errors: string[] };
    games?: {
      errors: string[];
      items?: {
        errors: string[];
        properties?: {
          id?: { errors: string[] };
          name?: { errors: string[] };
          slug?: { errors: string[] };
          cover?:
            | { errors: string[] }
            | {
                errors: string[];
                properties?: { image_id?: { errors: string[] } };
              };
        };
      }[];
    };
    description?: { errors: string[] };
  };
};

export type UserInfoType = {
  id: string;
  username: string;
  profile_image: string;
  created_at: string;
  nb_likes_made: number;
  nb_comments_made: number;
  nb_lists_created: number;
  nb_following: number;
  nb_followers: number;
};
