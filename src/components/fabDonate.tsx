'use client';

import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
export function FABDonate() {
    return (
        <Button
            size='icon'
            className='fixed right-6 bottom-6 h-14 w-14 rounded-full bg-pink-600 text-white shadow-lg transition-colors hover:bg-pink-700'
            aria-label='Donate'
            asChild
        >
            <Link href='https://buymeacoffee.com/pertinate' target='_blank'>
                <Heart className='h-7 w-7' />
            </Link>
        </Button>
    );
}
