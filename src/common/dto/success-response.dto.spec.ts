
import {
  PaginatedResponseDto,
  SuccessResponseDto,
  CreatedResponseDto,
  UpdatedResponseDto,
  DeletedResponseDto,
} from './success-response.dto';

describe('PaginatedResponseDto', () => {
  it('should be defined', () => {
    expect(new PaginatedResponseDto()).toBeDefined();
  });
});

describe('SuccessResponseDto', () => {
  it('should be defined', () => {
    expect(new SuccessResponseDto()).toBeDefined();
  });
});

describe('CreatedResponseDto', () => {
  it('should be defined', () => {
    expect(new CreatedResponseDto()).toBeDefined();
  });
});

describe('UpdatedResponseDto', () => {
  it('should be defined', () => {
    expect(new UpdatedResponseDto()).toBeDefined();
  });
});

describe('DeletedResponseDto', () => {
  it('should be defined', () => {
    expect(new DeletedResponseDto()).toBeDefined();
  });
});
