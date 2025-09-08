
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  UnauthorizedErrorResponseDto,
  NotFoundErrorResponseDto,
  InternalServerErrorResponseDto,
} from './error-response.dto';

describe('ErrorResponseDto', () => {
  it('should be defined', () => {
    expect(new ErrorResponseDto()).toBeDefined();
  });
});

describe('ValidationErrorResponseDto', () => {
  it('should be defined', () => {
    expect(new ValidationErrorResponseDto()).toBeDefined();
  });
});

describe('UnauthorizedErrorResponseDto', () => {
  it('should be defined', () => {
    expect(new UnauthorizedErrorResponseDto()).toBeDefined();
  });
});

describe('NotFoundErrorResponseDto', () => {
  it('should be defined', () => {
    expect(new NotFoundErrorResponseDto()).toBeDefined();
  });
});

describe('InternalServerErrorResponseDto', () => {
  it('should be defined', () => {
    expect(new InternalServerErrorResponseDto()).toBeDefined();
  });
});
