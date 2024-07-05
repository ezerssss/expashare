import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const CreatePosts = dynamic(() => import('../components/CreatePost'), {
    ssr: false,
});
const Posts = dynamic(() => import('../components/Posts'), {
    ssr: false,
});

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <CreatePosts />
                <Posts />
            </main>
        </>
    );
}
