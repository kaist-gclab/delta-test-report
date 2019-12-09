import { Logger } from '../logger';
import { createAppServer } from '../delta';

// 1. 3차원 모델 저장소 전체 크기 0.3TB
//     에셋 추가 반복
//     저장소에 대량의 3차원 모델을 입력하여, 전체 프레임워크에 등록될 수 있는 3차원 모델의 크기의 합계를 계산함. 이때, 지연 시간과 같은 기타 정량적 성능 항목의 달성 여부에 영향이 없어야 함.


// 4. 단일 3차원 모델 크기 50MB
//     크기가 큰 3차원 모델을 입력하여, 기본 작업이 문제없이 처리될 수 있는
//     단일 3차원 모델 크기를 계산함. 이때, 지연 시간과 같은 기타 정량적 성능 항목의 달성 여부에 영향이 없어야 함. 이 평가 항목은 프레임워크에서 제공하는 세부적인 알고리즘의 성능 사양이 아닌 클라우드 시스템의 성능 사양을 측정하는 것으로서, 처리 항목은 렌더링, 자료 구조 형성과 같은 기본 작업으로 한정함.

const logger = new Logger('store');

export async function run() {
    logger.info('store');
    const server = await createAppServer();
    const r = await server.get('api/1/assets');
    console.log(r.data);
}
