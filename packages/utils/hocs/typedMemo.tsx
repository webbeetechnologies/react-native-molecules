import { memo } from 'react';

const typedMemo: <T>(component: T) => T = memo;

export default typedMemo;
