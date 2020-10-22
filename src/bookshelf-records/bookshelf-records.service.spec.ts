import {Test, TestingModule} from '@nestjs/testing';
import {BookshelfRecordsService} from './bookshelf-records.service';

describe('BookshelfRecordsService', () => {
  let service: BookshelfRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookshelfRecordsService],
    }).compile();

    service = module.get<BookshelfRecordsService>(BookshelfRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
