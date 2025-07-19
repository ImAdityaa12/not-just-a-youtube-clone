import { Toaster } from '@/components/ui/sonner';
import HomeLayout from '@/modules/home/ui/layout/home-layout';
import React from 'react';

export const dynamic = 'force-dynamic';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <HomeLayout>
            <Toaster />
            {children}
        </HomeLayout>
    );
};

export default Layout;
