import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import AuthButton from '@/modules/auth/ui/components/auth-button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import StudioUploadModal from '@/modules/studio/ui/components/studio-navbar/studio-upload-modal';

const StudioNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-2 pr-5 z-50 border-b shadow-md">
            <div className="flex items-center gap-4 w-full">
                <div className="flex items-center flex-shrink-0 gap-4">
                    <SidebarTrigger />
                    <Link prefetch href={'/studio'} className="hidden md:block">
                        <div className="flex items-center gap-1">
                            <Image
                                src="/logo.svg"
                                alt="Logo"
                                width={32}
                                height={32}
                            />
                            <p className="font-semibold text-xl tracking-tighter">
                                Studio
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="flex-1" />
                <StudioUploadModal />
                <div className="flex-shrink-0 items-center flex gap-4">
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
};

export default StudioNavbar;
