import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Warehouse Command Center',
    template: '%s · Warehouse Command Center',
  },
  description:
    'High-end kitchen & bath warehouse and project-material control. A project cannot be released until every required material is received in usable, verified, and staged condition.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Warehouse Command Center',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'WCC' },
};

export const viewport: Viewport = {
  themeColor: '#2f3f55',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
