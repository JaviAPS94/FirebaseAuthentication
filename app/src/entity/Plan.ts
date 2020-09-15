import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { BillingRule } from './BillingRule';
import { FamilyPlan } from './FamilyPlan';

@Entity()
export class Plan {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column("text")
    description: string;

    @Column({ nullable: false })
    familyPlanId: number;

    @Column()
    externalId: string;

    @Column("json")
    additionalInfo: string;

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

    @OneToMany(type => BillingRule, billingRule => billingRule.plan, {
        cascade: true,
    }) 
    @JoinColumn()
    billingRules: BillingRule[];
    
    @ManyToOne(type => FamilyPlan, familyPlan => familyPlan.id) 
    familyPlan: FamilyPlan;

}
