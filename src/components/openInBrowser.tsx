'use client';

import Link from 'next/link';

export default function OpenInBrowser() {
    return (
        <Link href={`${window.location.protocol}//${window.location.host}`} target='_blank' rel='noopener noreferrer'>
            Open in Browser
        </Link>
    );
}
