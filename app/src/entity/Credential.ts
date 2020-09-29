import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Credential {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accountId: number;

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

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({
    type: "datetime",
    default: null
  })
  deletedAt: Date
}