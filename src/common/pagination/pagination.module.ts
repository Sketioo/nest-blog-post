import { Module } from '@nestjs/common';
import { PaginationProvider } from './provider/pagination.provider';

@Module({
  exports: [PaginationProvider],
  providers: [PaginationProvider],
})
export class PaginationModule {}
