import { VariantProps, cva } from "class-variance-authority";
import React from "react";
import { Avatar } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

const avatarVariats = cva("", {
  variants: {
    size: {
      default: "h-9 w-9",
      xs: "h-5 w-5",
      sm: "h-8 w-8",
      lg: "h-10 w-10",
      xl: "h-[160px] w-[160px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariats> {
  imageUrl: string;
  name: string;
  className?: string;
  onClick?: () => void;
}

const UserAvatar = ({
  imageUrl,
  name,
  size,
  className,
  onClick,
}: UserAvatarProps) => {
  return (
    <Avatar className={avatarVariats({ size, className })} onClick={onClick}>
      <AvatarImage src={imageUrl} alt={name} className="object-cover" />
    </Avatar>
  );
};

export default UserAvatar;
