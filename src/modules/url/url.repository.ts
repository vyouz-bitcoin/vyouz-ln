import { Repository } from 'typeorm';

import { UrlEntity } from './url.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UrlRepository extends Repository<UrlEntity> {
  constructor(
    @InjectRepository(UrlEntity)
    repository: Repository<UrlEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
