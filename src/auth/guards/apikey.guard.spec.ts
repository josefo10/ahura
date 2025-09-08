import { Reflector } from '@nestjs/core';
import { ApikeyGuard } from './apikey.guard';

describe('ApikeyGuard', () => {
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
  });

  it('should be defined', () => {
    expect(new ApikeyGuard(reflector)).toBeDefined();
  });
});
