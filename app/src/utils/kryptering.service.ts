import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class KrypteringService {
  private algorithm = process.env.ALGORITHM;
  private secretKey = process.env.ENCRYPTION_SECRET_KEY;
  private iv = crypto.randomBytes(16);

  constructor() { }

  public async encrypt(text: string) {
    const cipher = crypto.createCipheriv(this.algorithm, this.secretKey, this.iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      iv: this.iv.toString('hex'),
      content: encrypted.toString('hex')
    };
  }

  public async decrypt(hash: any) {
    const decipher = crypto.createDecipheriv(this.algorithm, this.secretKey, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
  }
}