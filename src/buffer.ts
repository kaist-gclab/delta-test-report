function getBufferBoundaries(data: Buffer) {
    const arr = [...data];

    const left = [];
    for (let i = 0; i < 16; i++) {
        left.push(Buffer.from([arr[i]]).toString('hex'));
    }
    const right = [];
    for (let i = arr.length - 16; i < arr.length; i++) {
        right.push(Buffer.from([arr[i]]).toString('hex'));
    }
    return left.join(' ') + '...' + right.join(' ');
}

export function getBufferSummary(data: Buffer) {
    return `[${data.length}] = {${getBufferBoundaries(data)}}`;
}