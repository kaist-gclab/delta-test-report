import axios from 'axios';
import { Logger } from './logger';

const BaseURL = 'http://localhost:18080/';

const logger = new Logger('delta')

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
}

export async function create() {
    const instance = axios.create({
        baseURL: BaseURL,
        timeout: 5000,
        headers: { 'Authorization': `Bearer ${await getToken()}` },
    })
    return instance;
}
