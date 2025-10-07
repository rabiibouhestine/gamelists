import Link from "next/link";
import Image from "next/image";
import { games, gameLists } from "./lib/data";
import GameList from "./ui/GameList";

export default function Home() {
  return (
    <div className="min-h-screen mb-20">
      <h1 className="text-6xl font-bold mt-20 mb-24">
        Track games you’ve played.
        <br />
        Save those you want to try.
        <br />
        Tell your friends what’s good.
      </h1>
      <div className="flex justify-between items-center border-b py-2">
        <h2 className="text-3xl font-semibold">Trending Games</h2>
        <Link href="/">See More</Link>
      </div>
      <div className="grid grid-cols-6 gap-2 mt-6">
        {games.map((game) => (
          <Link key={game.id} href="/">
            <Image
              src={game.img}
              alt={game.name}
              width={246}
              height={352}
              className="rounded-md"
            />
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center border-b py-2 mt-20">
        <h2 className="text-3xl font-semibold">Recent Lists</h2>
        <Link href="/">See More</Link>
      </div>
      <div className="flex flex-col gap-6">
        {gameLists.map((list) => (
          <GameList key={list.id} gamelist={list} />
        ))}
      </div>
    </div>
  );
}
