import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}