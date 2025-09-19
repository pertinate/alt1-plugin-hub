import '~/styles/globals.css';

import { type Metadata } from 'next';
import { Geist } from 'next/font/google';

import { TRPCReactProvider } from '~/trpc/react';
import { ThemeProvider } from '~/components/theme-provider';
import { AppHeader } from '~/components/appHeader';
import { FABDonate } from '~/components/fabDonate';
import { Toaster } from '~/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
    title: 'PluginHub',
    description: 'PluginHub for Alt1',
    icons: [
        { rel: 'icon', url: '/icon.png' }, // favicon
        { rel: 'apple-touch-icon', url: '/icon.png' }, // optional iOS icon
    ],
    openGraph: {
        title: 'PluginHub',
        description: 'PluginHub for Alt1',
        url: 'https://yourdomain.com',
        siteName: 'PluginHub',
        images: [
            {
                url: '/icon.png', // 1200×630 recommended
                width: 1200,
                height: 630,
                alt: 'PluginHub preview image',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PluginHub',
        description: 'PluginHub for Alt1',
        images: ['/icon.png'],
    },
};

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
});

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en' className={`${geist.variable}`} suppressHydrationWarning>
            <body className='flex min-h-screen flex-col'>
                <TRPCReactProvider>
                    <SessionProvider>
                        <ThemeProvider attribute={'class'} defaultTheme='system' enableSystem>
                            <AppHeader />
                            {children}
                        </ThemeProvider>
                    </SessionProvider>
                </TRPCReactProvider>
                <div id={'portal'} />
                <FABDonate />
                <Toaster />
            </body>
        </html>
    );
}
