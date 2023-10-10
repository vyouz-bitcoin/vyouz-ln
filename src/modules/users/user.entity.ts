import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from './dtos/UserDto';
import { AbstractEntity } from '../../common/abstract.entity';

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
