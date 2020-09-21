import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

type AdditionalInfo = {
  useExternalIds?: boolean
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  secret: string;

  @Column({
    type: "json",
    default: null
  })
  additionalInfo: AdditionalInfo

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