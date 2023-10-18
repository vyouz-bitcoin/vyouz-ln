import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WalletEntity } from './wallet.entity';

@Injectable()
export class WalletRepository extends Repository<WalletEntity> {
  constructor(
    @InjectRepository(WalletEntity)
    repository: Repository<WalletEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
