import Image from "next/image";

type GameList = {
  id: number;
  name: string;
  img: string;
};

type GameListCard = {
  id: number;
  title: string;
  description: string;
  nb_likes: number;
  nb_comments: number;
  creator: {
    user_id: number;
    username: string;
    profile_img: string;
  };
  list: GameList[];
};

type GameListProps = {
  gamelist: GameListCard;
};

export default function GameList({ gamelist }: GameListProps) {
  return (
    <div className="mt-6">
      <h3 className="font-bold text-2xl">{gamelist.title}</h3>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Image
            src={gamelist.creator.profile_img}
            alt={gamelist.creator.username}
            width={20}
            height={20}
            className="rounded-full w-4 h-4"
          />
          <span className="font-bold">{gamelist.creator.username}</span>
        </div>
        <span>{gamelist.list.length} Games</span>
        <span>{gamelist.nb_likes}</span>
        <span>{gamelist.nb_comments}</span>
      </div>
      <p className="mt-2 line-clamp-2">{gamelist.description}</p>
      <div className="w-full bg-card rounded-md mt-3 flex">
        {gamelist.list.slice(0, 8).map((game, index) => (
          <Image
            key={game.id}
            src={game.img}
            alt={game.name}
            width={246}
            height={352}
            className="object-cover rounded-md -mr-3 shadow-[2px_0_7px_#000]"
            style={{ zIndex: 8 - index }}
          />
        ))}
      </div>
    </div>
  );
}
