import Header from '@/components/Header';
import React from 'react';

function page() {
    return (
        <>
            <Header />
            <main>
                <h1 className="font-bold text-3xl">Welcome to expashare! 🌍</h1>
                <p>
                    Hello and welcome to expashare, your new hub for connecting
                    with fellow immigrants and integrating into your new
                    community!
                </p>

                <h2 className="font-bold text-xl mt-5">
                    What Can You Do Here?
                </h2>
                <ul className="list-disc">
                    <li>
                        Ask Questions: Get advice on local customs, job hunting,
                        and more.
                    </li>
                    <li>Share Your Story: Inspire others with your journey.</li>
                    <li>
                        Find Resources: Discover local services, language
                        classes, and events.
                    </li>
                    <li>
                        Build Connections: Meet new friends and grow your
                        network.
                    </li>
                </ul>

                <h2 className="font-bold text-xl mt-5">Community Guidelines</h2>
                <ul className="list-disc">
                    <li>Be Respectful: Treat everyone with kindness.</li>
                    <li>Stay On Topic: Keep discussions relevant.</li>
                    <li>Protect Privacy: Don't share personal information.</li>
                </ul>

                <p className="mt-10">
                    We're thrilled to have you here! Let's make expashare a
                    supportive and helpful community together 🎉.
                </p>
            </main>
        </>
    );
}

export default page;
