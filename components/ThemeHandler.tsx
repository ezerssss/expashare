'use client';

import { Moon, Sun } from 'lucide-react';
import React, { useState } from 'react';

function ThemeHandler() {
    const [isDark, setIsDark] = useState(false);

    function handleChangeTheme() {
        if (typeof window === undefined) {
            return;
        }

        // Change to light theme
        if (isDark) {
            document.body.classList.remove('dark-theme');
        } else {
            document.body.classList.add('dark-theme');
        }

        setIsDark((prevState) => !prevState);
    }

    const iconStyle = 'w-[25px] h-[25px] md:w-[30px] md:h-[30px]';

    return (
        <button onClick={handleChangeTheme}>
            {isDark ? (
                <Moon className={iconStyle} />
            ) : (
                <Sun className={iconStyle} />
            )}
        </button>
    );
}

export default ThemeHandler;
