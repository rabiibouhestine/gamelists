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

export type GameType = {
  igdb_id: number;
  image_id: string;
  name: string;
  slug: string;
  first_release_date: number;
  position?: number;
};

export type GameIGDBType = {
  id: number;
  cover: {
    id: number;
    image_id: string;
  };
  name: string;
  slug: string;
  first_release_date: number;
};

export type InvolvedCompany = {
  id: number;
  developer?: boolean;
  company?: {
    id?: string | number;
    name?: string;
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

export type ListFormActionType = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any,
  formData: FormData
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => Promise<any>;
