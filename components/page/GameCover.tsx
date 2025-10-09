import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

type GameCoverProps = {
  cover_id: string;
  alt: string;
  slug: string;
};

export default function GameCover({ cover_id, alt, slug }: GameCoverProps) {
  return (
    <Link href={`/games/${slug}`}>
      <Image
        src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${cover_id}.jpg`}
        alt={alt}
        width={246}
        height={352}
        className="h-50 rounded-md"
      />
    </Link>
  );
}

export function GameCoverSkeleton() {
  return <Skeleton className="h-50 rounded-md" />;
}
