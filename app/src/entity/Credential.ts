import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from './Account';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  projectId: string;

  @Column("json")
  privateKey: { iv: string, content: string };

  @Column()
  clientEmail: string;

  @Column()
  databaseUrl: string;

  @Column("json")
  apiKey: { iv: string, content: string };

  @Column()
  authDomain: string;

  @Column({ nullable: false })
  accountId: number;

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

  @OneToOne(type => Account, account => account.credential)
  @JoinColumn()
  account: Account;
}