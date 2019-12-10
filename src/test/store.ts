import { Logger } from '../logger';
import { createAppServer } from '../delta';
import crypto = require('crypto');
import moment = require('moment');
import { Stream } from 'stream';

const RandomSeed = 'TEST20191210';
const AssetSize = 50 * 1024 * 1024;
const TotalSize = Math.ceil(0.3 * 1024 * 1024 * 1024 * 1024);

const logger = new Logger('store');

async function getAssetCount() {
    const server = await createAppServer();
    const assets: any[] = (await server.get('api/1/assets')).data;
    return assets.length;
}

function getRandomText(seed: number, size: number) {
    const hash = crypto.createHash('SHA256');
    hash.update(RandomSeed + ' ' + seed.toString());
    const key = hash.digest().toString('hex');
    let text = '';
    while (text.length < size) {
        let add = key;
        if (text.length + key.length > size) {
            add = key.substr(0, size - text.length);
        }
        text += add;
    }
    return text;
}

async function addAsset(data: string): Promise<void> {
    const server = await createAppServer();
    const asset = (await server.post('api/1/assets', { content: data })).data;
    const assetId = asset.id;
    const value = '에셋 # ' + assetId;
    await server.post(`api/1/assets/${assetId}/tags`, {
        key: 'CustomKey',
        value,
    });
}

async function readAsset(assetId: string): Promise<Stream> {
    const server = await createAppServer();
    const response = await server.get(`api/1/assets/${assetId}/download`,
        { responseType: 'stream' });
    return response.data;
}

async function testCompleteListLatency() {
    const begin = moment();
    const count = await getAssetCount();
    const end = moment();
    const duration = moment.duration(end.diff(begin)).asSeconds();
    logger.info(`전체 에셋 목록 조회 작업에 ${duration}초가 소요되었습니다.`);
    logger.info(`전체 에셋 조회 결과로 ${count}개가 반환되었습니다.`);
}

async function testSearchLatency(assetId: number) {
    const value = '에셋 # ' + assetId;
    const server = await createAppServer();
    const begin = moment();
    const response = await server.get('api/1/assets', {
        params: {
            assetTagKey: 'CustomKey',
            assetTagValue: value,
        }
    });
    const end = moment();
    const duration = moment.duration(end.diff(begin)).asSeconds();
    logger.info(`에셋 태그를 이용한 에셋 검색 작업에 ${duration}초가 소요되었습니다.`);
    const assets = response.data;
    logger.info(`에셋 태그를 이용한 에셋 검색 결과로 ${assets.length}개가 조회되었습니다.`);
    logger.info(`검색 요청한 에셋은 ${assetId}번이며, 반환된 에셋은 ${assets[0].id}번입니다.`);
}

// https://stackoverflow.com/questions/10623798/how-do-i-read-the-contents-of-a-node-js-stream-into-a-string-variable
function streamToString(stream: Stream): Promise<string> {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => {
            const text = Buffer.concat(chunks).toString('utf8');
            resolve(text.substr(1, text.length - 2));
        });
    });
}

export async function run() {
    logger.info('store');
    logger.info(`SHA-256 salt ${RandomSeed}`);
    await getAssetCount();
    await testCompleteListLatency();
    logger.info(`단일 에셋 크기 ${AssetSize / 1024 / 1024} MB`);
    logger.info(`목표 에셋 크기 합계 ${Math.floor(TotalSize / 1024 / 1024)} MB`);
    const assets = Math.ceil(TotalSize / AssetSize);
    for (let assetId = 1; assetId <= assets; assetId++) {
        const data = getRandomText(assetId, AssetSize);
        await addAsset(data);
        if (assetId <= 5 || (assetId - 1) % 100 === 0 || assetId == assets) {
            logger.info(`${assetId}번 에셋 및 태그를 추가했습니다.`);
            const target = Math.floor((1 + assetId) / 2);
            logger.info(`에셋 태그를 이용하여 ${target}번 에셋을 검색합니다.`);
            await testSearchLatency(target);
        }
        if (assetId == 1 || assetId == assets) {
            await testCompleteListLatency();
        }
        if (assetId === 5) {
            logger.info('6번 에셋부터 동일한 결과는 100개 단위로 줄여 출력합니다.');
        }
    }
    logger.info(`에셋을 모두 ${assets}개 추가했습니다.`);
    for (let assetId = 1; assetId <= assets; assetId++) {
        const expect: string = getRandomText(assetId, AssetSize);
        const actual: Stream = await readAsset(assetId.toString());
        const actualString = await streamToString(actual);
        if (expect !== actualString) {
            logger.error(`${assetId}번 에셋 내용이 손상되었습니다.`);
        } else {
            if (assetId <= 5 || (assetId - 1) % 100 === 0 || assetId == assets) {
                logger.info(`${assetId}번 에셋 내용이 일치합니다.`);
                const target = Math.floor((1 + assetId) / 2);
                logger.info(`에셋 태그를 이용하여 ${target}번 에셋을 검색합니다.`);
                await testSearchLatency(target);
            }
            if (assetId == 1 || assetId == assets) {
                await testCompleteListLatency();
            }
            if (assetId === 5) {
                logger.info('6번 에셋부터 동일한 결과는 100개 단위로 줄여 출력합니다.');
            }
        }
    }
    await testCompleteListLatency();
    logger.info('3차원 모델 저장소 전체 크기 테스트를 완료했습니다.');
}
