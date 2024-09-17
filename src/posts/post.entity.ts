import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { postType } from './enums/post-type.enum';
import { postStatus } from './enums/post-status.enum';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.post,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.draft,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema: string;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 1024,
  })
  featuredImgUrl: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn: Date;

  //* Later for relationship
  tags: string[];

  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true,
    eager: true,
  })
  metaOptions?: MetaOption;
}
