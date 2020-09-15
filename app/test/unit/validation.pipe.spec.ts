import { ValidationPipe } from '../../src/validation.pipe';
import { DummyDto } from './dummy.dto';
import { BadRequestException } from 'test/e2e/plans/node_modules/@nestjs/common';

describe('ValidationPipe', () => {
    let validationPipe: ValidationPipe;

    beforeEach(() => {
        validationPipe = new ValidationPipe();
    });

    describe('transform', () =>{
        it('should return value object if validation is successful', async() => {
            const valueObject = { id: 1 };
            expect(await validationPipe.transform(valueObject, { type: "body", metatype: DummyDto})).toBe(valueObject);
        });

        it('should throw exception if validation fails', async () => {
            const valueObject = { id: "1" };
            await expect(validationPipe.transform(valueObject, { type: "body", metatype: DummyDto})).rejects.toThrow(BadRequestException);
        });
    });
});