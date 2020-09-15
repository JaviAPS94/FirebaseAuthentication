import { ValidationPipe } from '../../../../src/validation.pipe';
import { RecurringDto } from '../../../../src/plans/dto/recurring.dto';
import { BadRequestException } from 'test/e2e/plans/node_modules/@nestjs/common';

describe('RecurringDto', () => {
    let validationPipe: ValidationPipe;
    let valueObject;

    beforeEach(() => {
        validationPipe = new ValidationPipe();
    });

    it('should return value object if validation is successful', async() => {
        valueObject = { 
          usageType: "METERED",
          interval: "WEEK",
          intervalCount: 1
        };
        expect(await validationPipe.transform(valueObject, { type: "body", metatype: RecurringDto})).toBe(valueObject);
    });

    it('should throw exception if validation fails', async () => {
        valueObject = { 
          usageType: "INVALID",
          interval: "WEEK",
          intervalCount: "1"
        };
        await expect(validationPipe.transform(valueObject, { type: "body", metatype: RecurringDto})).rejects.toThrow(BadRequestException);
    });
});