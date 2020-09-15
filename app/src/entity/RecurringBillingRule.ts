import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { BillingRule } from "./BillingRule";

enum usageTypes {
  METERED = "METERED",
  LICENSED = "LICENSED"
}

enum intervals {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR"
}

@Entity()
export class RecurringBillingRule {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column("enum", { enum: usageTypes })
  usageType: usageTypes;

  @Column("enum", { enum: intervals })
  interval: intervals;

  @Column()
  intervalCount: number;

  @OneToOne(type => BillingRule, billingRule => billingRule.recurringBillingRule) @JoinColumn()
  billingRule: number;
}
