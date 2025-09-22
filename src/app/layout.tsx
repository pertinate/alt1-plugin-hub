import '~/styles/globals.css';

import { type Metadata } from 'next';
import { Geist } from 'next/font/google';

import { TRPCReactProvider } from '~/trpc/react';
import { ThemeProvider } from '~/components/theme-provider';
import { AppHeader } from '~/components/appHeader';
import { FABDonate } from '~/components/fabDonate';
import { Toaster } from '~/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
    title: 'PluginHub',
    description: 'PluginHub for Alt1',
    icons: [{ rel: 'icon', url: '/icon.png' }],
    openGraph: {
        title: 'PluginHub',
        description: 'PluginHub for Alt1',
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
                <Analytics />
            </body>
        </html>
    );
}
