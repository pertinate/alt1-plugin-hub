import type { Alt1Config } from '~/lib/alt1';

export async function fetchAlt1Config(url: string): Promise<Alt1Config> {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Failed to fetch config from ${url}: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();

    // Optionally, you could do runtime validation here
    return json as Alt1Config;
}
