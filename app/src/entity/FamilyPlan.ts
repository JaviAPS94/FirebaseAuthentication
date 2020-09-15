import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Plan } from "./Plan";

@Entity()
export class FamilyPlan {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ unique: true })
    externalId: string;

    @Column("json")
    additionalInfo: string;

    @Column({ nullable: false })
    accountId: number;

    @Column("tinyint", { nullable: false })
    active: number;

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

    @OneToMany(type => Plan, plans => plans.familyPlan) plans: Plan[];

}
