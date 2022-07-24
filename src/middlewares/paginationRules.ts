import { IsNumber, IsString, Length } from 'class-validator';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

interface QueryBeforeType {
  page: string;
  pageSize: string;
  searchNameTerm: string;
}

interface QueryTransformType {
  page: number;
  pageSize: number;
  searchNameTerm: string;
}

export class PaginationRules
  implements PipeTransform<QueryBeforeType, QueryTransformType>
{
  transform(
    query: QueryBeforeType,
    metadata: ArgumentMetadata,
  ): QueryTransformType {
    const page = parseInt(query.page, 10);
    const pageSize = parseInt(query.pageSize, 10);
    const searchNameTerm =
      typeof query.searchNameTerm === 'string' ? query.searchNameTerm : '';
    if (isNaN(page) || isNaN(pageSize)) {
      throw new BadRequestException('Validation failed');
    }
    return { page, pageSize, searchNameTerm };
  }
}
