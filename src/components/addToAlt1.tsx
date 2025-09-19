'use client';

import Link from 'next/link';
import { addPluginHubLink } from '~/lib/alt1';

export default function AddToAlt1() {
    return <Link href={addPluginHubLink()}>Add to Alt1</Link>;
}
