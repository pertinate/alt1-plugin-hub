'use client';

import { signOut } from '~/server/auth';
import { Button } from './ui/button';

export const SignOutBtn = () => {
    return (
        <Button variant={'outline'} onClick={() => signOut({ redirectTo: '/' })}>
            Sign Out
        </Button>
    );
};
