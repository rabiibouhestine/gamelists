import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

type GameCoverProps = {
  src: string;
  alt: string;
};

export default function GameCover({ src, alt }: GameCoverProps) {
  return (
    <Link href="/">
      <Image
        src={src}
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
