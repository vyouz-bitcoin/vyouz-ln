import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { TransactionEntity } from './transaction.entity';
@Injectable()
export class TransactionRepository extends Repository<TransactionEntity> {
  constructor(
    @InjectRepository(TransactionEntity)
    repository: Repository<TransactionEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
  async updateMany(
    ids: string[],
    updateTransactionDto: Partial<TransactionEntity>,
  ): Promise<number> {
    const n = await this.update({ id: In(ids) }, updateTransactionDto);
    return n.affected;
  }
}
