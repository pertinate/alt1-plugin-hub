import { getBaseUrl } from '~/util/baseUrl';

export async function GET() {
    return Response.json({
        appName: 'Plugin Hub',
        description: 'Alt1 Plugin Hub',
        appUrl: '/',
        configUrl: '/alt1/appconfig.json',
        iconUrl: '/icon.png',
        defaultWidth: 250,
        defaultHeight: 250,
        minWidth: 250,
        minHeight: 250,
        maxWidth: 500,
        maxHeight: 500,
        requestHandlers: [],
        activators: [],
        permissions: 'overlay',
    });
}
//alt1://addapp/http://localhost:3000/alt1/appconfig.json
