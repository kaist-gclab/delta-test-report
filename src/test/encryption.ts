import { Logger } from '../logger';
import { addAsset } from '../delta';
import { getRandomText, streamToBuffer } from './store';
import { readObject } from '../s3';
const AssetSize = 50 * 1024 * 1024;
const logger = new Logger('encryption');

function getBufferBoundaries(data: Buffer) {
    const arr = [...data];

    const left = [];
    for (let i = 0; i < 8; i++) {
        left.push(Buffer.from([arr[i]]).toString('hex'));
    }
    const right = [];
    for (let i = arr.length - 8; i < arr.length; i++) {
        right.push(Buffer.from([arr[i]]).toString('hex'));
    }
    return left.join(' ') + '...' + right.join(' ');
}

function getBufferSummary(data: Buffer) {
    return `[${data.length}] = {${getBufferBoundaries(data)}}`;
}

export async function run() {
    logger.info('encryption');
    const data = getRandomText(100000, AssetSize);
    logger.info('data' + getBufferSummary(Buffer.from(data)));
    const assetA = await addAsset(data);
    logger.info('assetA => ' + assetA.storeKey);
    const streamA = await readObject(assetA.storeKey);
    logger.info('dataA' + getBufferSummary(await streamToBuffer(streamA)));

    const assetB = await addAsset(data);
    logger.info('assetB => ' + assetB.storeKey);
    const streamB = await readObject(assetB.storeKey);

    logger.info('dataB' + getBufferSummary(await streamToBuffer(streamB)));

    const assetC = await addAsset(data, true);
    logger.info('assetC(암호화 적용) => ' + assetC.storeKey);
    const streamC = await readObject(assetC.storeKey);
    logger.info('dataC' + getBufferSummary(await streamToBuffer(streamC)));
}
