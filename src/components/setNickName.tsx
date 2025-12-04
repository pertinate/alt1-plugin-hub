'use client';

import { signOut } from 'next-auth/react';
import { Button } from './ui/button';

export const SetNickName = () => {
    return (
        <>
            <Button variant={'outline'} onClick={() => signOut({ redirectTo: '/' })}>
                Sign Out
            </Button>
        </>
    );
};
