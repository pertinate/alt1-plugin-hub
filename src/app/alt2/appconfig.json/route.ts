import { getBaseUrl } from '~/util/baseUrl';

export async function GET() {
    return Response.json({
        appName: 'Plugin Hub',
        description: 'Alt1 React starter kit',
        appUrl: '/plugins',
        configUrl: '/alt2/appconfig.json',
        iconUrl: '/icon.png',
        defaultWidth: 250,
        defaultHeight: 250,
        minWidth: 250,
        minHeight: 250,
        maxWidth: 500,
        maxHeight: 500,
        requestHandlers: [],
        activators: [],
        permissions: '',
    });
}
//alt1://addapp/http://localhost:3000/alt1/appconfig.json
