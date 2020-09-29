import { BadRequestException } from '@nestjs/common';
import { CredentialDto } from '../../../../src/firebase/dto/credential.dto';
import { ValidationPipe } from '../../../../src/validation.pipe';

describe('CredentialDto', () => {
  let validationPipe: ValidationPipe;
  let valueObject;

  beforeEach(() => {
    validationPipe = new ValidationPipe();
  });

  it('should return value object if validation is successful', async () => {
    valueObject = {
      accountId: 1,
      projectId: "authentication",
      privateKey: "authenticationKey",
      clientEmail: "authenticationClientEmail",
      databaseUrl: "authenticationDatabaseUrl",
      apiKey: "authenticationApiKey",
      authDomain: "authenticationAuthDomain"
    };
    expect(await validationPipe.transform(valueObject, { type: "body", metatype: CredentialDto })).toBe(valueObject);
  });

  it('should throw exception if validation fails', async () => {
    valueObject = {
      accountId: "1",
      projectId: "invalid",
      privateKey: "invalid",
      clientEmail: "invalid",
      databaseUrl: "invalid",
      apiKey: "invalid",
      authDomain: "invalid"
    };
    await expect(validationPipe.transform(valueObject, { type: "body", metatype: CredentialDto })).rejects.toThrow(BadRequestException);
  });
});