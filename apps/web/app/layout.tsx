import '@repo/design-system/styles/globals.css';
import './styles/web.css';
import HomeNav from '@/components/header';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import { Footer } from './components/footer';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(fonts, 'scroll-smooth')}
    suppressHydrationWarning
  >
    <body>
      <DesignSystemProvider defaultTheme="dark">
        <Toaster />
        {/* <Header /> */}
        <HomeNav />
        {children}
        <Footer />
      </DesignSystemProvider>
    </body>
  </html>
);

export default RootLayout;
