export interface Alt1Config {
    appName: string;
    description: string;
    appUrl: string;
    configUrl: string;
    iconUrl: string;
    defaultWidth: number;
    defaultHeight: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    requestHandlers: unknown[];
    activators: unknown[];
    permissions: string;
}

export const addPluginHubLink = () => {
    if (typeof window !== 'undefined') {
        // Client
        return `alt1://addapp/${window.location.protocol}//${window.location.host}/alt1/appconfig.json`;
    }

    // Server: prefer env variable
    return process.env.NEXT_PUBLIC_SITE_URL || 'alt1://addapp/http://localhost:3000/alt1/appconfig.json';
};
