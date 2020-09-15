export const mockPlans = {
    plans: [
      {
        name: "Plan 1",
        description: "Plan 1 description",
        externalId: "1",
        additionalInfo: {},
        active: 1,
        externalFamily: "TEST",
        billingRules:[
          {
            planId: 1,
            description: "monthly plan",
            productId: 1,
            type: "RECURRING",
            recurringBillingRule:{
              usageType:"METERED",
              interval: "MONTH",
              intervalCount:1
          },
            tags: "xyz",
            trialPeriodDays: 30,
            externalId: "1",
            additionalInfo: {},
            active:1
            }
        ]
    },
    {
      name: "Plan 2",
      description: "Plan 1 description",
      externalId: "2",
      additionalInfo: {},
      active: 1,
      externalFamily: "TEST",
      billingRules:[
        { 
          description: "billing rule 1",
          productId: 1,
          type: "RECURRING",
          recurringBillingRule:{
            billingRule:0,
            usageType:"METERED",
            interval: "MONTH",
            intervalCount:1
          },
          tags: "xyz",
          trialPeriodDays: 30,
          externalId: "1",
          additionalInfo: {},
          active:1
          },
          {
            description: "billing rule 2",
            productId: 1,
            type: "ONE_TIME",
            tags: "xyz",
            trialPeriodDays: 30,
            externalId: "2",
            additionalInfo: {},
            active:1
            }
      ]
  }
  ],
    familyPlans: [
      {
        name: "family plan 1",
        externalId: 'TEST',
        additionalInfo: {},
        accountId: 1,
        active: 1
      },
      {
        id: 2,
        name: "family plan 2",
        externalId: 'TEST2',
        additionalInfo: {},
        accountId: 1,
        active: 1
      }
    ]
  };

export const mockUpdatePlan = {
    name: "Plan Updated",
    description: "Plan 1 description updated",
    additionalInfo: {},
    active: 1,
    billingRules:[
        {
        planId: 1,
        description: "monthly plan updated",
        productId: 1,
        type: "RECURRING",
        recurringBillingRule:{
            usageType:"METERED",
            interval: "MONTH",
            intervalCount:1
        },
        tags: "xyz updated",
        trialPeriodDays: 30,
        externalId: "1",
        additionalInfo: {},
        active:1
        }
    ]
};
