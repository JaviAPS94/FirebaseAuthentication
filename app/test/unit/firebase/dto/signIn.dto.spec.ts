import { BadRequestException } from '@nestjs/common';
import { SignInDto } from '../../../../src/firebase/dto/signIn.dto';
import { ValidationPipe } from '../../../../src/validation.pipe';

describe('CredentialDto', () => {
  let validationPipe: ValidationPipe;
  let valueObject;

  beforeEach(() => {
    validationPipe = new ValidationPipe();
  });

  it('should return value object if validation is successful', async () => {
    valueObject = {
      email: "test@test.com",
      password: "123456789"
    };
    expect(await validationPipe.transform(valueObject, { type: "body", metatype: SignInDto })).toBe(valueObject);
  });

  it('should throw exception if validation fails', async () => {
    valueObject = {
      email: "testFail",
      password: "123456789"
    };
    await expect(validationPipe.transform(valueObject, { type: "body", metatype: SignInDto })).rejects.toThrow(BadRequestException);
  });
});