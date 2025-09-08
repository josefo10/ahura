import { bootstrap } from './main';

describe('main', () => {
  it('should call bootstrap function without errors', async () => {
    await expect(bootstrap()).resolves.not.toThrow();
  });
});