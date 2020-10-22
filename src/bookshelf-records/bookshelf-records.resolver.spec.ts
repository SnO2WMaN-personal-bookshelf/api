import {Test, TestingModule} from '@nestjs/testing';
import {BookshelfRecordsResolver} from './bookshelf-records.resolver';

describe('BookshelfRecordsResolver', () => {
  let resolver: BookshelfRecordsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookshelfRecordsResolver],
    }).compile();

    resolver = module.get<BookshelfRecordsResolver>(BookshelfRecordsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
