import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Plan } from "./Plan";
import { SubscriptionItem } from './SubscriptionItem'
import { RecurringBillingRule } from "./RecurringBillingRule";

enum types {
    ONE_TIME = "ONE_TIME",
    RECURRING = "RECURRING"
}

@Entity()
export class BillingRule {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    description: string;

    @Column()
    productId: number;

    @Column("enum", { enum: types })
    type: types;

    @Column({ nullable: true })
    tag: string;

    @Column({ nullable: true })
    trialPeriodDays: number

    @Column({ nullable: true })
    externalId: number

    @Column("json", { nullable: true })
    additionalInfo: string

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

    @ManyToOne(type => Plan, plans => plans.id) plan: Plan;

    @OneToMany(type => SubscriptionItem, subscriptionItem => subscriptionItem.billingRule)
    subscriptionItems: SubscriptionItem[];

    @OneToOne(type => RecurringBillingRule, recurringBillingRule => recurringBillingRule.billingRule, {
        cascade: true,
    })
    recurringBillingRule: RecurringBillingRule;
}
