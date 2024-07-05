'use client';

import db from '@/firebase/db';
import useUser from '@/hooks/useUser';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { twMerge } from 'tailwind-merge';

const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        ['link', 'image'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
];

function CreatePost() {
    const { user, isLoggedIn } = useUser();

    const [value, setValue] = useState<ReactQuill.Value>();
    const [isPosting, setIsPosting] = useState(false);

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
            alert('login to post');
            return;
        }

        if (isQuillEmpty(value?.toString())) {
            alert('post should not be empty');
            return;
        }

        try {
            setIsPosting(true);

            const postsColRef = collection(db, 'posts');

            await addDoc(postsColRef, {
                user_id: user.uid,
                user_email: user.email,
                data: value,
                date_posted: Timestamp.now(),
                last_edited: Timestamp.now(),
                hearts: 0,
            });

            alert('successfully posted');
            setValue(undefined);
        } catch (error) {
            console.error(error);
            alert('Something went wrong.');
        } finally {
            setIsPosting(false);
        }
    }

    return (
        <>
            <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                value={value}
                placeholder="Share your heart"
                onChange={setValue}
            />
            <button
                className={twMerge(
                    'mt-3 py-1',
                    isLoggedIn ? 'underline link-color' : 'text-gray-400',
                )}
                disabled={!isLoggedIn || isPosting}
                onClick={handlePost}
            >
                {isPosting
                    ? 'posting...'
                    : isLoggedIn
                    ? 'post'
                    : 'log in to post'}
            </button>
        </>
    );
}

export default CreatePost;
