import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BookshelvesService} from './bookshelves.service';
import {Bookshelf} from './entity/bookshelf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookshelf])],
  providers: [BookshelvesService],
})
export class BookshelvesModule {}
