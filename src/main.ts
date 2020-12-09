import * as mkdirp from 'mkdirp';

import { run as testStore } from './test/store';
import { run as testNodes } from './test/nodes';
import { run as testFormats } from './test/formats';
import { run as testEncryption } from './test/encryption';
import { run as testScreens } from './test/screens';

export async function run() {
    await mkdirp('output');
    // await testStore();
    // await testNodes();
    // await testFormats();
    // await testEncryption();
    await testScreens();
}
