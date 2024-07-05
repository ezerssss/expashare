import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'refushare',
    description: 'Reddit for refugees',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="p-5 md:py-10 md:px-40 lg:py-20 lg:px-60 xl:px-96">
                {children}
            </body>
        </html>
    );
}
