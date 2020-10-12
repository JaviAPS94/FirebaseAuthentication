import { Module } from '@nestjs/common';
import { AccountModule } from '../../src/account/account.module';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [AccountModule],
  controllers: [FirebaseController],
  exports: [FirebaseService],
  providers: [FirebaseService]
})
export class FirebaseModule { }