'use client';

import db from '@/firebase/db';
import useUser from '@/hooks/useUser';
import {
    CollectionReference,
    DocumentData,
    DocumentReference,
    QueryDocumentSnapshot,
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getCountFromServer,
    getDocs,
    increment,
    limit,
    orderBy,
    query,
    setDoc,
    startAfter,
    updateDoc,
    where,
} from 'firebase/firestore';
import { HandHeart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { twMerge } from 'tailwind-merge';

const postsCollectionRef = collection(db, 'posts');

interface IDocument {
    data: ReactQuill.Value;
    date_posted: Timestamp;
    last_edited: Timestamp;
    user_id: string;
    user_email: string;
    hearts: number;
}

function Post(props: {
    document: DocumentReference<DocumentData, DocumentData>;
    commentCollection: CollectionReference<DocumentData, DocumentData>;
    data: DocumentData;
}) {
    const { user, isLoggedIn } = useUser();
    const { data, user_email } = props.data as IDocument;
    const [isLiked, setIsLiked] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);
    const [hearts, setHearts] = useState(props.data.hearts);

    const [newComment, setNewComment] = useState<ReactQuill.Value>();
    const [isPosting, setIsPosting] = useState(false);

    const [comments, setComments] = useState<
        {
            document: DocumentReference<DocumentData, DocumentData>;
            data: DocumentData;
        }[]
    >([]);

    useEffect(() => {
        (async () => {
            // const commentsCollectionRef = collection(
            //     db,
            //     'posts',
            //     props.document.id,
            //     'comments',
            // );

            const commentsCollectionRef = props.commentCollection;

            try {
                const docs = await getDocs(commentsCollectionRef);

                const commentsArray: {
                    document: DocumentReference<DocumentData, DocumentData>;
                    data: DocumentData;
                }[] = [];
                docs.forEach((doc) =>
                    commentsArray.push({ document: doc.ref, data: doc.data() }),
                );
                setComments(commentsArray);
            } catch (error) {
                console.error(error);
                alert('something went wrong with fetching comments');
            }
        })();
    }, []);

    function isQuillEmpty(quillString: string | undefined) {
        if (!quillString) {
            return true;
        }

        if (
            quillString.replace(/<(.|\n)*?>/g, '').trim().length === 0 &&
            !quillString.includes('<img')
        ) {
            return true;
        }
        return false;
    }

    async function handlePost() {
        if (!isLoggedIn || !user) {
            alert('login to comment');
            return;
        }

        if (isQuillEmpty(newComment?.toString())) {
            alert('comment should not be empty');
            return;
        }

        try {
            setIsPosting(true);

            const postsColRef = props.commentCollection;

            const commentRef = await addDoc(postsColRef, {
                user_id: user.uid,
                user_email: user.email,
                data: newComment,
                date_posted: Timestamp.now(),
                last_edited: Timestamp.now(),
                hearts: 0,
            });

            setNewComment(undefined);
            setComments([
                ...comments,
                {
                    document: commentRef,
                    data: {
                        user_id: user.uid,
                        user_email: user.email,
                        data: newComment,
                        date_posted: Timestamp.now(),
                        last_edited: Timestamp.now(),
                        hearts: 0,
                    },
                },
            ]);
            alert('successfully commented');
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
        } finally {
            setIsPosting(false);
        }
    }

    useEffect(() => {
        if (!user) {
            return;
        }

        (async () => {
            const likesCollectionRef = collection(
                db,
                'users',
                user.uid,
                'likes',
            );

            const q = query(
                likesCollectionRef,
                where('post_id', '==', props.document.id),
                limit(1),
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setIsLiked(false);
            } else {
                setIsLiked(true);
            }
        })();
    }, [user]);

    async function handleHeart() {
        if (!user || !isLoggedIn) {
            alert('login to give hearts');
            return;
        }

        try {
            if (isLiked) {
                const updatePost = updateDoc(props.document, {
                    hearts: increment(-1),
                });
                const removeFromLikeCollection = deleteDoc(
                    doc(db, 'users', user.uid, 'likes', props.document.id),
                );

                await Promise.all([updatePost, removeFromLikeCollection]);

                setHearts(hearts - 1);

                setIsLiked(false);
            } else {
                const updatePost = updateDoc(props.document, {
                    hearts: increment(1),
                });
                const addToLikeCollection = setDoc(
                    doc(db, 'users', user.uid, 'likes', props.document.id),
                    { post_id: props.document.id },
                );

                await Promise.all([updatePost, addToLikeCollection]);

                setHearts(hearts + 1);

                setIsLiked(true);
            }
        } catch (error) {
            console.error(error);
            alert('something went wrong');
        } finally {
            setIsLikeLoading(false);
        }
    }

    return (
        <article className="mb-5">
            <ReactQuill readOnly value={data} theme="bubble" className="post" />
            <hr />
            <p className="text-sm mb-2">
                by{' '}
                <span className="placeholder-color text-xs">{user_email}</span>
            </p>
            <button
                className="flex gap-1 items-center ml-3 text-sm"
                disabled={isLikeLoading}
                onClick={handleHeart}
            >
                <HandHeart
                    strokeWidth={1.3}
                    size={20}
                    className={twMerge(isLiked && 'liked')}
                />{' '}
                {hearts}
            </button>

            <section className="flex gap-4 mt-3">
                <div className="flex-1">
                    <ReactQuill
                        theme="bubble"
                        value={newComment}
                        onChange={setNewComment}
                        readOnly={!isLoggedIn}
                        placeholder="add comment"
                        className="placeholder-color"
                    />
                </div>
                {isLoggedIn && (
                    <button
                        className={twMerge(
                            '-mt-2 text-sm px-[15px]',
                            'underline link-color',
                        )}
                        disabled={isPosting}
                        onClick={handlePost}
                    >
                        {isPosting ? 'posting...' : 'post comment'}
                    </button>
                )}
            </section>
            <hr className="-mt-2 mb-2" />
            <section className="pl-10 border-l-2">
                {comments.map((comment) => {
                    const commentsCollectionRef = collection(
                        db,
                        props.commentCollection.path,
                        comment.document.id,
                        'comments',
                    );

                    console.log(props.commentCollection.path);

                    return (
                        <Post
                            key={comment.document.id}
                            document={comment.document}
                            data={comment.data}
                            commentCollection={commentsCollectionRef}
                        />
                    );
                })}
            </section>
        </article>
    );
}

function Posts() {
    const [totalCount, setTotalCount] = useState(0);
    const [posts, setPosts] = useState<
        {
            document: DocumentReference<DocumentData, DocumentData>;
            data: DocumentData;
        }[]
    >([]);

    useEffect(() => {
        (async () => {
            try {
                const snapshot = await getCountFromServer(postsCollectionRef);
                setTotalCount(snapshot.data().count);
            } catch (error) {
                console.error(error);
                alert('something went wrong with fetching posts.');
            }
        })();
    }, []);

    useEffect(() => {
        (async () => await fetchData())();
    }, []);

    async function fetchData() {
        try {
            let q = query(
                postsCollectionRef,
                orderBy('date_posted', 'desc'),
                limit(20),
            );

            if (posts.length > 0) {
                q = query(q, startAfter(posts[posts.length - 1]));
            }

            const snapshot = await getDocs(q);
            const postArray: {
                document: DocumentReference<DocumentData, DocumentData>;
                data: DocumentData;
            }[] = [];

            snapshot.forEach((doc) =>
                postArray.push({ document: doc.ref, data: doc.data() }),
            );

            setPosts([...posts, ...postArray]);
        } catch (error) {
            console.error(error);
            alert('something went wrong with fetching posts');
        }
    }

    return (
        <section className="mt-10">
            <InfiniteScroll
                dataLength={totalCount}
                next={fetchData}
                hasMore={posts.length !== totalCount}
                loader={
                    <h4 className="text-sm placeholder-color">
                        loading posts...
                    </h4>
                }
            >
                {posts.map((post) => {
                    const commentsCollectionRef = collection(
                        db,
                        'posts',
                        post.document.id,
                        'comments',
                    );

                    return (
                        <Post
                            key={post.document.id}
                            document={post.document}
                            data={post.data}
                            commentCollection={commentsCollectionRef}
                        />
                    );
                })}
            </InfiniteScroll>
        </section>
    );
}

export default Posts;
