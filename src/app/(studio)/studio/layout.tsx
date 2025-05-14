import { Toaster } from '@/components/ui/sonner';
import StudioLayout from '@/modules/studio/ui/layouts/studio-sidebar';
import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <StudioLayout>
            <Toaster />
            {children}
        </StudioLayout>
    );
};

export default Layout;
