import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchGameInfo } from "@/lib/igdb";
import { Skeleton } from "@/components/ui/skeleton";

import type { InvolvedCompany } from "@/lib/definitions";

export default async function GameInfoCard({ slug }: { slug: string }) {
  const gameInfo = await fetchGameInfo(slug);

  const release_date = new Date(gameInfo.first_release_date * 1000);
  const formatted_release_date = release_date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="bg-card border rounded-md p-6 flex gap-6">
      <div className="flex flex-col gap-3 min-w-50">
        <Image
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameInfo.cover?.image_id}.jpg`}
          alt={gameInfo.name}
          width={246}
          height={352}
          className="border rounded-md"
        />
        <Button asChild variant={"outline"}>
          <Link href={gameInfo.url} target="_blank">
            See on IGDB
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-3xl font-bold">{gameInfo.name}</h1>
        <div>
          <span className="text-muted-foreground">Released on </span>
          <span className="font-semibold">{formatted_release_date} </span>
          <span className="text-muted-foreground">by </span>
          <span className="font-semibold">
            {gameInfo.involved_companies &&
              gameInfo.involved_companies
                .filter((c: InvolvedCompany) => c.developer)
                .map((c: InvolvedCompany) => c.company?.name)
                .join(", ")}
          </span>
        </div>
        <p className="mt-3">{gameInfo.summary}</p>
        <p className="mt-6 mb-2 text-muted-foreground">Platforms:</p>
        <div className="flex flex-wrap gap-2">
          {gameInfo.platforms &&
            gameInfo.platforms.map((platform: { id: number; name: string }) => (
              <Badge key={platform.id} variant="outline">
                {platform.name}
              </Badge>
            ))}
        </div>
        <p className="mt-3 mb-2 text-muted-foreground">Genres:</p>
        <div className="flex flex-wrap gap-2">
          {gameInfo.genres &&
            gameInfo.genres.map((genre: { id: number; name: string }) => (
              <Badge key={genre.id} variant="outline">
                {genre.name}
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
}

export function GameInfoCardSkeleton() {
  return <Skeleton className="bg-card border rounded-md h-90" />;
}
