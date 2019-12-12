import { Logger } from '../logger';
import { addAsset, readAsset } from '../delta';
import { getRandomText, streamToBuffer, streamToString } from './store';
import { readObject } from '../s3';
import { getBufferSummary } from '../buffer';
const AssetSize = 50 * 1024 * 1024;
const logger = new Logger('encryption');

export async function run() {
    logger.info('encryption');
    const data = getRandomText(100000, AssetSize);
    logger.info('data' + getBufferSummary(Buffer.from(data)));
    const assetA = await addAsset(data);
    logger.info('assetA => ' + assetA.storeKey);
    const objA = await streamToBuffer(await readObject(assetA.storeKey));
    logger.info('objA' + getBufferSummary(objA));

    const assetB = await addAsset(data, true);
    logger.info('assetB(암호화 적용) => ' + assetB.storeKey);
    const objB = await streamToBuffer(await readObject(assetB.storeKey));
    logger.info('objB' + getBufferSummary(objB));

    const assetC = await addAsset(data, true);
    logger.info('assetC(암호화 적용) => ' + assetC.storeKey);
    const objC = await streamToBuffer(await readObject(assetC.storeKey));
    logger.info('objC' + getBufferSummary(objC));

    if (Buffer.compare(objA, objB) !== 0 &&
        Buffer.compare(objA, objC) !== 0 &&
        Buffer.compare(objB, objC) !== 0) {
        logger.info('오브젝트 저장소에 암호화 적용된 데이터가 저장되었습니다.');
    } else {
        logger.error('오브젝트 저장소 암호화 적용 여부 검증에 실패했습니다.');
    }

    const serverA = Buffer.from(await streamToString(await readAsset(assetA.id)));
    const serverB = Buffer.from(await streamToString(await readAsset(assetB.id)));
    const serverC = Buffer.from(await streamToString(await readAsset(assetC.id)));
    logger.info('serverA' + getBufferSummary(serverA));
    logger.info('serverB' + getBufferSummary(serverB));
    logger.info('serverC' + getBufferSummary(serverC));

    if (Buffer.compare(Buffer.from(data), serverA) === 0 &&
        Buffer.compare(serverA, serverB) === 0 &&
        Buffer.compare(serverB, serverC) === 0) {
        logger.info('서버에서 정상적으로 복호화된 데이터가 다운로드되었습니다.');
    } else {
        logger.error('서버 복호화 성공 여부 검증에 실패했습니다.');
    }
}
