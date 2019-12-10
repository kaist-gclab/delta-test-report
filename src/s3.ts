import minio = require('minio');
import { Logger } from './logger';
import { Stream } from 'stream';
const logger = new Logger('s3');

const Endpoint = 'localhost';
const Port = 9000;
const BucketName = 'delta';

if (!process.env.DELTA_OBJECT_STORAGE_ACCESS_KEY) {
    logger.error('DELTA_OBJECT_STORAGE_ACCESS_KEY');
    process.exit(-1);
}

if (!process.env.DELTA_OBJECT_STORAGE_SECRET_KEY) {
    logger.error('DELTA_OBJECT_STORAGE_SECRET_KEY');
    process.exit(-1);
}

const client = new minio.Client({
    endPoint: Endpoint,
    port: Port,
    useSSL: false,
    accessKey: process.env.DELTA_OBJECT_STORAGE_ACCESS_KEY,
    secretKey: process.env.DELTA_OBJECT_STORAGE_SECRET_KEY,
});

export async function readObject(key: string): Promise<Stream> {
    return await client.getObject(BucketName, key);
}

export async function writeObject(key: string, buffer: Buffer): Promise<void> {
    await client.putObject(BucketName, key, buffer);
}
