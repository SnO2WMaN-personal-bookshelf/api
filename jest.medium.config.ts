import type {Config} from '@jest/types';
import base from './jest.config';

const config: Config.InitialOptions = {
  ...base,
  collectCoverage: false,
  testMatch: ['<rootDir>/**/*.db-test.ts'],
};
export default config;
