import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Credential } from './Credential';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  externalId: string;

  @Column("tinyint")
  active: number

  @Column(
    {
      type: "timestamp",
      default: () => 'CURRENT_TIMESTAMP',
      nullable: false
    }
  )
  createdAt: Date;

  @Column(
    {
      type: "timestamp",
      default: () => 'CURRENT_TIMESTAMP',
      nullable: false
    }
  )
  updateAt: Date;

  @Column("timestamp", { nullable: true })
  deleteAt: Date;

  @OneToOne(type => Credential, credential => credential.account, {
    cascade: true,
  })
  credential: Credential;
}