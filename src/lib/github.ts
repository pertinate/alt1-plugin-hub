export interface GithubRepositoryInfo {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    html_url: string;
    description: string;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    homepage: unknown;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;
    forks_count: number;
    mirror_url: unknown;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: License;
    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;
    topics: unknown[];
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
    permissions: Permissions;
}

export interface Owner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    user_view_type: string;
    site_admin: boolean;
}

export interface License {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
}

export interface Permissions {
    admin: boolean;
    maintain: boolean;
    push: boolean;
    triage: boolean;
    pull: boolean;
}

export interface GithubSearch {
    total_count: number;
    incomplete_results: boolean;
    items: Item[];
}

export interface Item {
    name: string;
    path: string;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    repository: Repository;
    score: number;
}

export interface Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    html_url: string;
    description: any;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;
}

// Your repo may not be readily available to search.
// Allow some time after searching once
export async function getAppConfigs(owner: string, repo: string, token: string) {
    // Search for appconfig.json files in the specific repo
    console.log(owner, repo);
    const searchUrl = `https://api.github.com/search/code?q=filename:appconfig.json+repo:${owner}/${repo}`;

    const searchRes = await fetch(searchUrl, {
        headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!searchRes.ok) {
        throw new Error(`GitHub Search failed: ${searchRes.status}`);
    }

    const searchData = (await searchRes.json()) as GithubSearch;

    console.log(JSON.stringify(searchData));

    // If no items found, return empty array
    if (!searchData.items || !Array.isArray(searchData.items) || searchData.items.length === 0) {
        return [];
    }

    // Get raw JSON for each found file
    // const configs = await Promise.all(
    //     searchData.items.map(async (item: GithubRepo) => {
    //         // Use the contents_url to fetch the raw file
    //         const fileRes = await fetch(item.url, {
    //             headers: {
    //                 Accept: 'application/vnd.github.v3.raw', // get raw file instead of base64
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         if (!fileRes.ok) {
    //             throw new Error(`Failed to fetch ${item.path}: ${fileRes.status}`);
    //         }

    //         // Try to parse as JSON, fallback to string if not possible
    //         let content: unknown;
    //         try {
    //             content = await fileRes.json();
    //         } catch {
    //             content = await fileRes.text();
    //         }

    //         return {
    //             repo: item.repository.full_name,
    //             path: item.path,
    //             content,
    //         };
    //     })
    // );

    // return configs;

    return undefined;
}

export async function getUserRepos(token: string) {
    return (await (
        await fetch('https://api.github.com/user/repos', {
            headers: { Authorization: `Bearer ${token}` },
        })
    ).json()) as GithubRepositoryInfo[];
}
