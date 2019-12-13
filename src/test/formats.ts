import { Logger } from '../logger';
import { addAsset, addProcessorType, registerProcessorNode, addJob } from '../delta';
import { getRandomText } from './store';
import { getBufferSummary } from '../buffer';
const logger = new Logger('formats');
const AssetSize = 16 * 1024; // 16K

export async function run() {
    logger.info('formats');

    const processorType = await addProcessorType('demo-type');
    logger.info(`처리기 유형(${processorType.id}, ${processorType.key})이 추가되었습니다.`);

    const AssetFormats = [
        'ASSET-FORMAT-KEY-STL-BINARY',
        'ASSET-FORMAT-KEY-STL-ASCII',
        'ASSET-FORMAT-KEY-DELTA',
    ];

    const assetData = [];
    const assets = [];
    for (let i = 0; i < AssetFormats.length; i++) {
        const key = AssetFormats[i];
        const data = getRandomText(i, AssetSize);
        assetData.push(data);
        logger.info('data ' + key + getBufferSummary(Buffer.from(data)));
        const asset = await addAsset(data, false, key);
        assets.push(asset);
        logger.info('asset ' + key + '.id: ' + asset.id);
    }

    const nodeIdList = [];
    for (let i = 0; i < AssetFormats.length; i++) {
        const nodeId = await addNode('NODE-' + AssetFormats[i], AssetFormats[i]);
        nodeIdList.push(nodeId);
    }

    for (let i = 0; i < AssetFormats.length; i++) {
        for (let j = 0; j < AssetFormats.length; j++) {
            const a = AssetFormats[i];
            const b = AssetFormats[j];
            logger.info(`에셋 형식 ${a} 에셋과, 처리기 버전 입력 능력 에셋 형식 ${b} 처리기 버전 사이의 작업을 추가 시도합니다.`);

            try {
                await addJob({
                    inputAssetId: assets[i].id,
                    jobArguments: '',
                    processorVersionKey: b,
                });
                logger.info('작업 추가에 성공했습니다.');
            } catch {
                logger.info('작업 추가에 실패했습니다.');
            }
        }
    }
    logger.info('에셋 형식 테스트를 마칩니다.');
}

async function addNode(key: string, assetFormatKey: string) {
    const logger = new Logger(key);
    logger.info(key);
    const node = await registerProcessorNode({
        processorTypeKey: 'demo-type',
        processorVersionKey: assetFormatKey,
        processorVersionDescription: 'demo-description',
        processorNodeKey: key,
        processorNodeName: key,
        inputCapabilities: [{
            assetFormatKey,
            assetTypeKey: null,
        }]
    });
    logger.info('처리기 노드 ' + node.id + '번으로 등록되었습니다. ' +
        '이 처리기는 오직 ' + assetFormatKey + ' 에셋 형식과 호환됩니다.');
    return node.id;
}
