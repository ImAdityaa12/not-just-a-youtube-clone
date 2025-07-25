import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import { TRPCProvider } from '@/trpc/client';

const inter = Inter({ subsets: ['latin'] });
export const metadata: Metadata = {
    title: 'YouTube Clone',
    description:
        'A modern YouTube clone built with Next.js, featuring video streaming, subscriptions, and more.',
    icons: {
        icon: '/logo.svg',
        shortcut: '/logo.svg',
        apple: '/logo.svg',
    },
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <html lang="en" suppressHydrationWarning>
                <body className={`${inter.className} antialiased`}>
                    <TRPCProvider> {children}</TRPCProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
