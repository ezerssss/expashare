import auth from '@/firebase/auth';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

function useUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    });

    return { user, isLoggedIn: !!user };
}

export default useUser;
