import { ValidationPipe } from '../../../../src/validation.pipe';
import { BillingRuleDto } from '../../../../src/plans/dto/billing-rule.dto';
import { BadRequestException } from 'test/e2e/plans/node_modules/@nestjs/common';

describe('BillingRuleDto', () => {
    let validationPipe: ValidationPipe;
    let valueObject;

    beforeEach(() => {
        validationPipe = new ValidationPipe();
    });

    it('should return value object if validation is successful', async() => {
        valueObject = { 
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
        };
        expect(await validationPipe.transform(valueObject, { type: "body", metatype: BillingRuleDto})).toBe(valueObject);
    });

    it('should throw exception if validation fails', async () => {
        valueObject = { 
          id: 3,
          planId: 1,
          description: "monthly plan",
          productId: 1,
          type: "INVALID",
          recurringBillingRule:{
            billingRule: 0,
            usageType:"METERED",
            interval: "INVALID",
            intervalCount:1
          },
          tags: "xyz",
          trialPeriodDays: 30,
          billingRulesId: "1",
          additionalInfo: {},
          active: 1
        };
        await expect(validationPipe.transform(valueObject, { type: "body", metatype: BillingRuleDto})).rejects.toThrow(BadRequestException);
    });
});