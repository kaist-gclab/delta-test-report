import axios from 'axios';
import { Logger } from './logger';
const logger = new Logger('delta');

if (!process.env.DELTA_SERVER_PORT) {
    logger.error('DELTA_SERVER_PORT');
    process.exit(-1);
}

const BaseURL = `http://localhost:${process.env.DELTA_SERVER_PORT}/`;


logger.info('애플리케이션 서버 주소 ' + BaseURL);

let token = null;
async function getToken() {
    if (token !== null) {
        return token;
    }
    logger.info('토큰 발급 요청 시작');
    const response = await axios.post(BaseURL + 'auth/1/login', {
        Username: 'DefaultAdminUser',
        Password: 'TEST_DELTA_ADMIN_PASSWORD',
    });
    logger.info('토큰 발급 요청 완료');
    token = response.data.token;
    logger.info('발급된 토큰: ' + token);
    return token;
}

export async function createAppServer() {
    const instance = axios.create({
        baseURL: BaseURL,
        timeout: 60 * 1000,
        headers: { 'Authorization': `Bearer ${await getToken()}` },
        maxContentLength: 1024 * 1024 * 200,
    })
    return instance;
}
