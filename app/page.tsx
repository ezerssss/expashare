'use client';

import CreatePost from '@/components/CreatePost';
import Header from '@/components/Header';
import Posts from '@/components/Posts';

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <CreatePost />
                <Posts />
            </main>
        </>
    );
}
