import { run as testStore } from './test/store';
import { run as testNodes } from './test/nodes';
import { run as testFormats } from './test/formats';
import { run as testEncryption } from './test/encryption';

export async function run() {
    await testStore();
    await testNodes();
    await testFormats();
    await testEncryption();
}
