import { existsSync, mkdirSync, writeFile } from 'fs';
import { promisify } from 'util';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const writeFilePromisified = promisify(writeFile);

const targetPath = './src/environments/environment.ts';

const envConfigFile = `export const environment = {
    production: false,
    auth0: {
        domain: '${process.env['AUTH0_DOMAIN']}',
        clientId: '${process.env['AUTH0_CLIENT_ID']}',
        authorizationParams: {
            audience: '${process.env['AUTH0_AUDIENCE']}',
            redirect_uri: '${process.env['AUTH0_CALLBACK_URL']}',
        },
        errorPath: '/callback',
        httpInterceptor: {
            allowedList: ['${process.env['API_SERVER_URL']}/api/*']
        }
    },
    api: {
        serverUrl: '${process.env['API_SERVER_URL']}',
    },
};
`;

(async () => {
    try {
        await ensureDirectoryExistence(targetPath);
        await writeFilePromisified(targetPath, envConfigFile);
    } catch (err) {
        console.error(err);
        throw err;
    }
})();

function ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (existsSync(dirname)) {
        return;
    }
    ensureDirectoryExistence(dirname);
    mkdirSync(dirname);
    return;
}
