import { Logger } from '../logger';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
const logger = new Logger('screens');

async function saveScreenshot(page: puppeteer.Page, name: string) {
    const fileName = `output/${name}.png`;
    const buffer = await page.screenshot({ encoding: 'binary', fullPage: true });
    fs.writeFileSync(fileName, buffer);
    logger.info('스크린샷 ' + fileName + ' 저장 완료');
}

function waitForH1(page: puppeteer.Page, title: string) {
    return page.waitForFunction(`document.querySelector('h1')?.innerText === '${title}'`);
}

export async function run() {
    logger.info('screens');

    const browser = await puppeteer.launch({
        args: ['--lang=ko-KR'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 768 });

    const url = `http://localhost:${process.env.DELTA_WEB_PORT}/`;
    logger.info(`웹 서버 주소 ${url}`);

    await page.goto(url);
    await page.waitForSelector('button');
    logger.info('로그인 페이지로 이동 완료');
    await page.type('input[type=password]', process.env.DELTA_AUTH_ADMIN_PASSWORD);
    logger.info('암호 입력 완료');
    await saveScreenshot(page, '01');
    await page.click('button');
    logger.info('로그인 버튼 클릭 완료');
    await waitForH1(page, '시작');
    logger.info('로그인 성공');

    const screens = [
        { url: '/start', title: '시작', fileName: '02' },
        { url: '/help', title: '도움말', fileName: '03' },
        { url: '/settings/user', title: '사용자 설정', fileName: '04' },
        { url: '/settings/system', title: '시스템 설정', fileName: '05' },
        { url: '/asset/assets/add', title: '애셋 추가', fileName: '06' },
        { url: '/asset/assets/list', title: '애셋 목록', fileName: '07' },
        { url: '/asset/assets/detail', title: '애셋 상세 조회', fileName: '08' },
        { url: '/asset/assets/viewer', title: '애셋 뷰어', fileName: '09' },
        { url: '/asset/asset-types/add', title: '애셋 유형 추가', fileName: '10' },
        { url: '/asset/asset-types/list', title: '애셋 유형 목록', fileName: '11' },
        { url: '/asset/asset-types/detail', title: '애셋 유형 상세 조회', fileName: '12' },
        { url: '/settings/viewers/list', title: '뷰어 목록', fileName: '13' },
        { url: '/job/jobs/add', title: '작업 추가', fileName: '14' },
        { url: '/job/jobs/list', title: '작업 목록', fileName: '15' },
        { url: '/job/jobs/detail', title: '작업 상세 조회', fileName: '16' },
        { url: '/job/job-types/list', title: '작업 유형 목록', fileName: '17' },
        { url: '/job/job-types/detail', title: '작업 유형 상세 조회', fileName: '18' },
        { url: '/node/processor-nodes/list', title: '처리기 노드 목록', fileName: '19' },
        { url: '/node/processor-nodes/detail', title: '처리기 노드 상세 조회', fileName: '20' },
        { url: '/key/encryption-keys/add', title: '암호화 키 추가', fileName: '21' },
        { url: '/key/encryption-keys/list', title: '암호화 키 목록', fileName: '22' },
        { url: '/key/encryption-keys/detail', title: '암호화 키 상세 조회', fileName: '23' },
        { url: '/monitoring/dashboard', title: '모니터링 대시보드', fileName: '24' },
        { url: '/monitoring/object-storage', title: '오브젝트 저장소 모니터', fileName: '25' },
        { url: '/monitoring/processor-node', title: '처리기 노드 모니터', fileName: '26' },
        { url: '/monitoring/jobs', title: '작업 모니터', fileName: '27' },
    ];

    for (const screen of screens) {
        await page.goto(new URL(screen.url, url).href);
        logger.info(`${screen.title} 페이지로 이동 시작`);
        await waitForH1(page, screen.title);
        logger.info(`${screen.title} 페이지로 이동 성공`);
        await saveScreenshot(page, screen.fileName);
    }

    await browser.close();
}
