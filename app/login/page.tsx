'use client';

import { KeyRound } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import {
    GoogleAuthProvider,
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth';
import auth from '@/firebase/auth';
import delay from '@/util/delay';
import { useRouter } from 'next/navigation';
import {
    Timestamp,
    collection,
    doc,
    getDocs,
    query,
    setDoc,
    where,
} from 'firebase/firestore';
import db from '@/firebase/db';

const GoogleProvider = new GoogleAuthProvider();
GoogleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

function page() {
    const [loadingStates, setLoadingStates] = useState({
        emailPass: false,
        signUp: false,
        google: false,
    });

    const router = useRouter();

    async function updateUserDoc(user: User) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(
            userDocRef,
            {
                id: user.uid,
                email: user.email,
                last_sign_in: Timestamp.now(),
            },
            { merge: true },
        );
    }

    async function handleGoogleLogin() {
        try {
            setLoadingStates({ ...loadingStates, google: true });

            const { user } = await signInWithPopup(auth, GoogleProvider);
            await updateUserDoc(user);

            alert(`welcome ${user.email}, redirecting to home page`);
            await delay(1000);
            router.push('/');
        } catch (error) {
            alert('Error trying to login using Google.');
            console.log(error);
        } finally {
            setLoadingStates({ ...loadingStates, google: false });
        }
    }

    async function handleEmailLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoadingStates({ ...loadingStates, emailPass: true });

            const email = e.currentTarget.email.value;
            const password = e.currentTarget.password.value;

            const { user } = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );

            alert(`welcome ${user.email}, redirecting to home page`);
            await delay(1000);

            router.push('/');
        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                if (error.message.includes('invalid-credential')) {
                    alert('invalid credentials');

                    return;
                }
            }

            alert('Something went wrong.');
        } finally {
            setLoadingStates({ ...loadingStates, emailPass: false });
        }
    }

    async function handleEmailSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoadingStates({ ...loadingStates, signUp: true });

            const email = e.currentTarget.email.value;
            const password = e.currentTarget.password.value;
            const confirmPassword = e.currentTarget['confirm-password'].value;

            if (password !== confirmPassword) {
                alert('passwords do not match!');

                return;
            }

            const userExistQuery = query(
                collection(db, 'users'),
                where('email', '==', email),
            );

            const result = await getDocs(userExistQuery);
            if (!result.empty) {
                alert('email already used by another user.');

                return;
            }

            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            );

            await updateUserDoc(user);

            alert(`welcome ${user.email}, redirecting to home page`);
            await delay(1000);

            router.push('/');
        } catch (error) {
            alert('Something went wrong.');
            console.error(error);
        } finally {
            setLoadingStates({ ...loadingStates, signUp: false });
        }
    }

    return (
        <main>
            <h1 className="mb-10">
                login to post in{' '}
                <Link href="/" className="font-bold underline link-color">
                    refushare
                </Link>
            </h1>

            <section>
                <h2 className="mb-3 text-lg font-semibold">email & password</h2>

                <form
                    className="space-y-2 w-full max-w-[400px]"
                    onSubmit={(e) => handleEmailLogin(e)}
                >
                    <input
                        required
                        name="email"
                        placeholder="email"
                        type="email"
                        className="outline-none border-b-2 block w-full"
                    />
                    <input
                        required
                        name="password"
                        placeholder="password"
                        minLength={6}
                        type="password"
                        className="outline-none border-b-2 block w-full"
                    />

                    <button
                        type="submit"
                        className="text-sm link-color underline"
                        disabled={loadingStates.emailPass}
                    >
                        {loadingStates.emailPass ? 'logging in...' : 'log in'}
                    </button>
                </form>
            </section>
            <section className="my-10">
                <h2 className="mb-3 text-lg font-semibold">create account</h2>

                <form
                    className="space-y-2 w-full max-w-[400px]"
                    onSubmit={(e) => handleEmailSignUp(e)}
                >
                    <input
                        required
                        name="email"
                        placeholder="email"
                        type="email"
                        className="outline-none border-b-2 block w-full"
                    />
                    <input
                        required
                        name="password"
                        placeholder="password"
                        minLength={6}
                        type="password"
                        className="outline-none border-b-2 block w-full"
                    />
                    <input
                        required
                        name="confirm-password"
                        placeholder="confirm password"
                        minLength={6}
                        type="password"
                        className="outline-none border-b-2 block w-full"
                    />

                    <button
                        type="submit"
                        className="text-sm link-color underline"
                        disabled={loadingStates.signUp}
                    >
                        {loadingStates.signUp ? 'signing up...' : 'sign up'}
                    </button>
                </form>
            </section>

            <section>
                <h2 className="mb-3 text-lg font-semibold">using Google</h2>

                <button
                    className="px-2 py-1 border text-sm link-color flex items-center gap-2"
                    disabled={loadingStates.google}
                    onClick={handleGoogleLogin}
                >
                    {loadingStates.google ? (
                        'logging in...'
                    ) : (
                        <>
                            <KeyRound size={17} />
                            Sign in with Google
                        </>
                    )}
                </button>
            </section>
        </main>
    );
}

export default page;
