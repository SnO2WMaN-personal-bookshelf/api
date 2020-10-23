import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import {FETCH_MAX, PaginateArgsType} from './paginate.argstype';

describe('PaginateArgsType', () => {
  let target: ValidationPipe;

  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: PaginateArgsType,
    data: '',
  };

  beforeEach(() => {
    target = new ValidationPipe();
  });

  describe('Validation Pipeによって除外される', () => {
    it('firstに負の値を入れる', async () => {
      const dto = {first: -1};
      await expect(target.transform(dto, metadata)).rejects.toThrow(
        BadRequestException,
      );
    });

    it(`firstに${FETCH_MAX}より大きな値を渡す`, async () => {
      const dto = {first: FETCH_MAX + 1};
      await expect(target.transform(dto, metadata)).rejects.toThrow(
        BadRequestException,
      );
    });

    it(`firstに0を渡す`, async () => {
      const dto = {first: 0};
      await expect(target.transform(dto, metadata)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
