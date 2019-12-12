import { Logger } from '../logger';
import { addAsset, readAsset, addProcessorType, registerProcessorNode, addJob, schedule, addJobResult, getJobExecution } from '../delta';
import { getRandomText, streamToString } from './store';
import { getBufferSummary } from '../buffer';
const logger = new Logger('nodes');
const AssetSize = 16 * 1024; // 16K

const Nodes = 5;

export async function run() {
    logger.info('nodes');

    const processorType = await addProcessorType('demo-type');
    logger.info(`처리기 유형(${processorType.id}, ${processorType.key})이 추가되었습니다.`);

    const assetData = [];
    const assets = [];
    for (let i = 0; i < Nodes; i++) {
        const data = getRandomText(i, AssetSize);
        assetData.push(data);
        logger.info('data' + i + getBufferSummary(Buffer.from(data)));
        const asset = await addAsset(data);
        assets.push(asset);
        logger.info('asset' + i + '.id: ' + asset.id);
    }

    const nodeIdList = [];
    for (let i = 0; i < Nodes; i++) {
        const nodeId = await addNode('NODE-' + i.toString());
        nodeIdList.push(nodeId);
    }

    for (let i = 0; i < Nodes; i++) {
        const job = await addJob({
            inputAssetId: assets[i].id,
            jobArguments: '',
            processorVersionKey: 'demo-version',
        });
        logger.info(`에셋 ${assets[i].id}번이 입력되는 작업 ${job.id}가 추가되었습니다.`);
    }

    const promises = [];
    for (let i = 0; i < Nodes; i++) {
        const promise = runNode('NODE-' + i.toString(), nodeIdList[i]);
        promises.push(promise);
    }
    logger.info('모든 처리기 노드 작업이 완료되기를 기다리고 있습니다.');
    const jobExecutionIdList = await Promise.all(promises);
    // TODO Promise.all에서 rejected 발생하는 경우를 처리해야합니다.
    logger.info('모든 처리기 노드 작업이 완료되었습니다.');
    logger.info('결과 에셋 내용 검증을 시작합니다.');
    for (let i = 0; i < Nodes; i++) {
        logger.info(`처리기 노드 ${nodeIdList[i]}번에 할당된 작업 번호는 ${jobExecutionIdList[i]}입니다.`);
        const jobExecution = await getJobExecution(jobExecutionIdList[i]);
        const assetId = jobExecution.childAssets[0].id;
        const assetContent = await streamToString(await readAsset(assetId.toString()));
        const assetContentString = Buffer.from(assetContent, 'base64').toString('utf-8');
        logger.info(`결과 에셋 ${jobExecution.childAssets.length}개가 조회되었으며, ` +
            `결과 에셋 중 첫 번째 에셋의 내용은 ${assetContentString}입니다.`);
    }
    logger.info('처리기 노드 테스트를 마칩니다.');
}

async function addNode(key: string) {
    const logger = new Logger(key);
    logger.info(key);
    const node = await registerProcessorNode({
        processorTypeKey: 'demo-type',
        processorVersionKey: 'demo-version',
        processorVersionDescription: 'demo-description',
        processorNodeKey: key,
        processorNodeName: key,
        inputCapabilities: [{
            assetFormatKey: null,
            assetTypeKey: null,
        }]
    });
    logger.info('처리기 노드 ' + node.id + '번으로 등록되었습니다.');
    return node.id;
}

async function runNode(key: string, id: number) {
    const logger = new Logger(key);
    const jobExecution = await schedule(id);
    logger.info('작업 실행 ' + jobExecution.id + '번이 할당되었습니다.');
    logger.info('지연 시작');
    await delay(30 * 1000);
    logger.info('지연 종료');
    await addJobResult({
        jobExecutionId: jobExecution.id,
        resultAssets: [{
            assetFormatKey: null,
            assetTypeKey: null,
            assetTags: [],
            content: Buffer.from(key).toString('base64'),
        }],
    });
    logger.info('작업 실행 결과 추가를 완료했습니다.');
    return jobExecution.id;
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}
