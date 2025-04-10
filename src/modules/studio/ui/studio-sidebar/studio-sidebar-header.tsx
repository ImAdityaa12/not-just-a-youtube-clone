import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user-avatar';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React from 'react'

const StudioSidebarHeader = () => {
  const {user} = useUser();
  const {state} = useSidebar();
  if (!user) {
   return (
    <div className='flex items-center justify-center flex-col mb-2'>
      <Skeleton className='w-[112px] h-[112px] rounded-full' />
      <Skeleton className='w-[112px] h-4 rounded-full mt-2' />
      <Skeleton className='w-[112px] h-4 rounded-full mt-2' />
    </div>
   )
  }

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip={"Your Profile"} asChild>
          <Link href="/users/current" className='flex items-center'>
            <UserAvatar imageUrl={user?.imageUrl || "User"} name={user?.fullName || ""} size={"xs"} />
            <span className='text-sm'>Your Profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }
  return (
    <SidebarHeader className='flex items-center justify-center'>
      <Link href="/users/current">
        <UserAvatar imageUrl={user?.imageUrl || "User"} name={user?.fullName || ""} className='size-[112px] hover:opacity-80 transition-opacity' />
      </Link>
      <div className='mt-2 flex items-center justify-center flex-col'>
        <h1 className='text-sm font-semibold'>{user?.fullName}</h1>
        <p className='text-xs text-muted-foreground'>{user?.emailAddresses[0]?.emailAddress}</p>
      </div>
    </SidebarHeader>
  )
}

export default StudioSidebarHeader