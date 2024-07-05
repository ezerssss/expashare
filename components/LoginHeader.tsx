'use client';

import React from 'react';
import useUser from '@/hooks/useUser';
import auth from '@/firebase/auth';
import Link from 'next/link';

function LoginHeader() {
    const { isLoggedIn } = useUser();

    async function handleLogout() {
        try {
            if (isLoggedIn) {
                await auth.signOut();
                alert('successfully logged out');
            }
        } catch (error) {
            alert('Something went wrong.');
            console.error(error);
        }
    }

    return isLoggedIn ? (
        <button disabled={!isLoggedIn} onClick={handleLogout} className="pl-3">
            Log out
        </button>
    ) : (
        <Link href="/login" className="pl-3">
            Log in
        </Link>
    );
}

export default LoginHeader;
