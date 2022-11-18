import axios from 'axios';
import { Stream } from 'stream';
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
        Password: process.env.DELTA_AUTH_ADMIN_PASSWORD,
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

export async function getAssetCount() {
    const server = await createAppServer();
    const assets: any[] = (await server.get('api/1/assets')).data;
    return assets.length;
}

let keyCreated = false;
export async function addAsset(data: string, encrypt: boolean = false, assetFormatKey: string = null): Promise<any> {
    const server = await createAppServer();
    if (encrypt) {
        if (!keyCreated) {
            await server.post('api/1/encryptionKeys', {
                name: "KeyName", enabled: true
            });
            keyCreated = true;
        }
    }
    if (assetFormatKey) {
        await server.post('api/1/assets/formats', {
            key: assetFormatKey,
            name: assetFormatKey,
            description: assetFormatKey,
        });
    }
    const asset = (await server.post('api/1/assets', {
        content: data,
        assetFormatKey,
        encryptionKeyName: encrypt ? "KeyName" : undefined,
    })).data;

    const assetId = asset.id;
    const value = '에셋 # ' + assetId;
    await server.post(`api/1/assets/${assetId}/tags`, {
        key: 'CustomKey',
        value,
    });
    return asset;
}

export async function addProcessorType(key: string): Promise<any> {
    const server = await createAppServer();
    const processorType = (await server.post('api/1/processors/types',
        { key: key })).data;
    return processorType;
}

export async function registerProcessorNode(registerProcessorNodeRequest): Promise<any> {
    const server = await createAppServer();
    const processorNode = (await server.post('api/1/processors/nodes/register',
        registerProcessorNodeRequest)).data;
    return processorNode;
}

export async function readAsset(assetId: string): Promise<Stream> {
    const server = await createAppServer();
    const logger = new Logger('delta');
    logger.info(`GET api/1/assets/${assetId}/download`);
    const response = await server.get(`api/1/assets/${assetId}/download`,
        { responseType: 'stream' });
    return response.data;
}

interface JobExecution {
    id: number
    jobId: number
    processorNodeId: number
    job: Job
    childAssets: Asset[]
}

interface Asset {
    id: number
}

interface Job {
    id: number
    inputAssetId: number
}

export async function schedule(processorNodeId: number): Promise<JobExecution> {
    const server = await createAppServer();
    const jobExecution: JobExecution = (await server.post(`api/1/jobs/schedule`,
        { processorNodeId })).data;;
    return jobExecution;
}

interface AddJobRequest {
    inputAssetId: number
    jobArguments: string
    processorVersionKey: string
}

export async function addJob(addJobRequest: AddJobRequest): Promise<JobExecution> {
    const server = await createAppServer();
    const logger = new Logger('delta');
    logger.info('POST api/1/jobs');
    const job = (await server.post(`api/1/jobs`, addJobRequest)).data;
    return job;
}

interface AddJobResultRequest {
    jobExecutionId: number
    resultAssets: RequestResultAsset[]
}

interface RequestResultAsset {
    assetFormatKey: string
    assetTypeKey: string
    assetTags?: RequestAssetTag[]
    content: string
}

interface RequestAssetTag {
    key: string
    value: string
}

export async function addJobResult(addJobResultRequest: AddJobResultRequest): Promise<any> {
    const server = await createAppServer();
    const logger = new Logger('delta');
    logger.info('POST api/1/jobs/result');
    const jobExecutionStatus = (await server.post('api/1/jobs/result', addJobResultRequest)).data;
    return jobExecutionStatus;
}

export async function getJobExecution(id: number): Promise<JobExecution> {
    const server = await createAppServer();
    const logger = new Logger('delta');
    logger.info(`GET api/1/jobs/executions/${id}`);
    const jobExecution: JobExecution = (await server.get(`api/1/jobs/executions/${id}`)).data;
    return jobExecution;
}
