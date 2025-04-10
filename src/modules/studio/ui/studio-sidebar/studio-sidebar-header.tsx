import { SidebarHeader } from '@/components/ui/sidebar';
import UserAvatar from '@/components/user-avatar';
import { useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React from 'react'

const StudioSidebarHeader = () => {
  const {user} = useUser();
  if (!user) {
    return null;
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