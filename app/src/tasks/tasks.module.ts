import { Module } from '@nestjs/common';
import { AccountModule } from '../../src/account/account.module';
import { FirebaseModule } from '../../src/firebase/firebase.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [FirebaseModule, AccountModule],
  providers: [TasksService],
})
export class TasksModule { }