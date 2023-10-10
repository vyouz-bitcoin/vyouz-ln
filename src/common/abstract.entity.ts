'use strict';

import { Exclude } from 'class-transformer';
import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { AbstractDto } from './dto/AbstractDto';
import { UtilsService } from '../providers/utils.service';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn('uuid')
  id = uuidv4();

  @CreateDateColumn({ type: 'timestamp without time zone', name: 'created_at' })
  createdAt = moment().toDate();

  @UpdateDateColumn({ type: 'timestamp without time zone', name: 'updated_at' })
  updatedAt = moment().toDate();

  @Exclude()
  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: false,
  })
  metaData: Record<string, any>;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Exclude()
  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any): any {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
