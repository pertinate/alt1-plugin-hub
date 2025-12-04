'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { addPluginHubLink } from '~/lib/alt1';
import { api } from '~/trpc/react';

export default function AddToAlt1() {
    return <Link href={addPluginHubLink()}>Add to Alt1</Link>;
}
