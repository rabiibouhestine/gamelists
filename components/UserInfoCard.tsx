import Image from "next/image";

import type { UserInfoType } from "@/lib/definitions";
import FollowButton from "@/components/FollowButton";
import UsernameForm from "@/components/UsernameForm";

type UserInfoCardProps = {
  userInfo: UserInfoType;
  showEditBtns: boolean;
  showFollowBtn: boolean;
  is_following: boolean;
};

export default function UserInfoCard({
  userInfo,
  showEditBtns,
  showFollowBtn,
  is_following,
}: UserInfoCardProps) {
  const created_at = new Date(userInfo.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-card border rounded-md p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={userInfo.profile_image}
          alt={userInfo.username}
          width={80}
          height={80}
          className="rounded-full w-20 h-20"
        />
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{userInfo.username}</h1>
              {showEditBtns && <UsernameForm username={userInfo.username} />}
            </div>
            <span className="text-muted-foreground">
              Member since {created_at}
            </span>
          </div>
          {showFollowBtn && (
            <FollowButton user_id={userInfo.id} is_following={is_following} />
          )}
        </div>
      </div>
      <div className="flex items-center divide-x-2">
        <div className="flex flex-col items-center py-1 px-4">
          <span className="text-2xl font-bold">{userInfo.nb_likes_made}</span>
          <span className="text-muted-foreground text-sm">Likes</span>
        </div>
        <div className="flex flex-col items-center py-1 px-4">
          <span className="text-2xl font-bold">
            {userInfo.nb_comments_made}
          </span>
          <span className="text-muted-foreground text-sm">Comments</span>
        </div>
        <div className="flex flex-col items-center py-1 px-4">
          <span className="text-2xl font-bold">
            {userInfo.nb_lists_created}
          </span>
          <span className="text-muted-foreground text-sm">Lists</span>
        </div>
        <div className="flex flex-col items-center py-1 px-4">
          <span className="text-2xl font-bold">{userInfo.nb_following}</span>
          <span className="text-muted-foreground text-sm">Following</span>
        </div>
        <div className="flex flex-col items-center py-1 px-4">
          <span className="text-2xl font-bold">{userInfo.nb_followers}</span>
          <span className="text-muted-foreground text-sm">Followers</span>
        </div>
      </div>
    </div>
  );
}
