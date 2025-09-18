'use client';

import { Heart } from 'lucide-react';
import { Button } from './ui/button';

export function FABDonate() {
    return (
        <Button
            onClick={() => {
                // Replace with your donation link or handler
                window.open('https://your-donation-link.example', '_blank');
            }}
            size='icon'
            className='fixed right-6 bottom-6 h-14 w-14 rounded-full bg-pink-600 text-white shadow-lg transition-colors hover:bg-pink-700'
            aria-label='Donate'
        >
            <Heart className='h-7 w-7' />
        </Button>
    );
}
