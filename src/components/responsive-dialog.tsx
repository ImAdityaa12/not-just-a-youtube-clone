import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader } from './ui/drawer';
import { Dialog } from './ui/dialog';

interface ResponsiveDialogProps {
    children: React.ReactNode;
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
}

const ResponsiveDialog = ({
    children,
    open,
    title,
    onOpenChange,
}: ResponsiveDialogProps) => {
    const isMobile = useIsMobile();
    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>{title}</DrawerHeader>
                    {children}
                </DrawerContent>
            </Drawer>
        );
    } else {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>{title}</DrawerHeader>
                    {children}
                </DrawerContent>
            </Dialog>
        );
    }
};

export default ResponsiveDialog;
