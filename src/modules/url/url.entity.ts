import { Column, Entity, ManyToOne } from 'typeorm';
import { UrlDto } from './dto/url.dto';
import { AbstractEntity } from '../../common/abstract.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'urls' })
export class UrlEntity extends AbstractEntity<UrlDto> {
  @Column()
  originalUrl: string;

  @Column({ unique: true }) // Add unique constraint for indexing
  shortenedUrl: string;

  @Column({ default: 0 })
  click: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: 0 })
  clicksPaidOut: number;

  //  @Column({ nullable: true })
  // userId: string;

  // @Column({ nullable: true })
  // userId: string;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  user: UserEntity;

  dtoClass = UrlDto;
}
