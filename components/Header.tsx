import { HeartHandshake } from 'lucide-react';
import React from 'react';
import ThemeHandler from './ThemeHandler';
import Link from 'next/link';
import LoginHeader from './LoginHeader';

function Header() {
    return (
        <header className="flex justify-between items-center mb-16">
            <div className="flex gap-3 md:gap-5 items-start">
                <HeartHandshake
                    className="h-14 w-14 md:h-20 md:w-20"
                    strokeWidth={1.2}
                />
                <div>
                    <h1 className="font-semibold text-xl md:text-2xl">
                        expashare
                    </h1>
                    <div className="flex text-sm link-color">
                        <Link href="/" className="header-link-border pr-3">
                            Home
                        </Link>
                        <Link href="/about" className="header-link-border px-3">
                            About
                        </Link>
                        <LoginHeader />
                    </div>
                </div>
            </div>
            <ThemeHandler />
        </header>
    );
}

export default Header;
