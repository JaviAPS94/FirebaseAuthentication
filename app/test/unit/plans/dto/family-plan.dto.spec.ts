import { ValidationPipe } from '../../../../src/validation.pipe';
import { FamilyPlanDto } from '../../../../src/plans/dto/family-plan.dto';
import { BadRequestException } from 'test/e2e/plans/node_modules/@nestjs/common';

describe('FamilyPlanDto', () => {
    let validationPipe: ValidationPipe;
    let valueObject;

    beforeEach(() => {
        validationPipe = new ValidationPipe();
    });

    it('should return value object if validation is successful', async() => {
        valueObject = { 
          id: 1,
          name: "family plan 1",
          externalId: 'EXTERNAL',
          additionalInfo: {},
          accountId: 1,
          active: 1
        };
        expect(await validationPipe.transform(valueObject, { type: "body", metatype: FamilyPlanDto})).toBe(valueObject);
    });

    it('should throw exception if validation fails', async () => {
        valueObject = { 
          id: 1,
          externalId: 'EXTERNAL',
          additionalInfo: {},
          accountId: 1,
          active: 1
        };
        await expect(validationPipe.transform(valueObject, { type: "body", metatype: FamilyPlanDto})).rejects.toThrow(BadRequestException);
    });
});