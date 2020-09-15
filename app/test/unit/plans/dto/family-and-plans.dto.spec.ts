import { ValidationPipe } from '../../../../src/validation.pipe';
import { FamilyAndPlansDto } from '../../../../src/plans/dto/family-and-plans.dto';
import { BadRequestException } from 'test/e2e/plans/node_modules/@nestjs/common';

describe('FamilyAndPlansDto', () => {
    let validationPipe: ValidationPipe;
    let valueObject;

    beforeEach(() => {
        validationPipe = new ValidationPipe();
    });

    it('should return value object if validation is successful', async() => {
        valueObject = {
          familyPlans: [
            {
              id: 1,
              name: "family plan 1",
              externalId: 'EXTERNAL',
              additionalInfo: {},
              accountId: 1,
              active: 1
            }
          ],
          plans: [
            {
              id: 1,
              name: "Plan 1",
              description: "Plan 1 description",
              familyPlanId: 0,
              externalId: "1",
              additionalInfo: {},
              active: 1,
              externalFamily: "EXTERNAL",
              billingRules: [
                { 
                  id: 3,
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
                  billingRulesId: "1",
                  additionalInfo: {},
                  active: 1
                }
              ]
            }
          ]
        };
        expect(await validationPipe.transform(valueObject, { type: "body", metatype: FamilyAndPlansDto})).toBe(valueObject);
    });

    it('should throw exception if validation fails', async () => {
        valueObject = {
          familyPlans: [],
          plans: [
            {
              id: 1,
              name: "Plan 1",
              description: "Plan 1 description",
              familyPlanId: 0,
              externalId: "1",
              additionalInfo: {},
              active: 1,
              externalFamily: "EXTERNAL",
              billingRules: [
                { 
                  id: 3,
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
                  billingRulesId: "1",
                  additionalInfo: {},
                  active: 1
                }
              ]
            }
          ]
        };
        await expect(validationPipe.transform(valueObject, { type: "body", metatype: FamilyAndPlansDto})).rejects.toThrow(BadRequestException);
    });
});