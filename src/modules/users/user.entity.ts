import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from './dtos/UserDto';
import { AbstractEntity } from '../../common/abstract.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class UserEntity extends AbstractEntity<UserDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column()
  country: string;

  @Column()
  accountType: string;

  dtoClass = UserDto;
}

//country
//email
//firstname
//lastname
//type : individual / organization
