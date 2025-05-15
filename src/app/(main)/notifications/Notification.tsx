import UserAvatar from "@/components/UserAvtar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NotificationProps {
  notification: NotificationData;
}

export default function Notification({ notification }: NotificationProps) {
  const [followed, setFollowed] = useState(false); // State to track if already followed

  // Function to handle following notification
  const handleFollow = () => {
    if (!followed) {
      setFollowed(true);
    }
  };

  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string; onClick?: () => void }
  > = {
    FOLLOW: {
      message: `followed you`, // Simplified message
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
      onClick: handleFollow, // Handle following action
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post`,
      icon: <MessageCircle className="size-7 fill-primary text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} liked your post`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href, onClick } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block" onClick={onClick}>
      <article
        className={cn(
          "flex gap-3 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <UserAvatar avatarUrl={notification.issuer.avatarUrl} size={36} />
          <div>
            <span className="font-bold">{notification.issuer.displayName}</span>{" "}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
