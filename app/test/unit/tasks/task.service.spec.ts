import { Test, TestingModule } from '@nestjs/testing';
import { AccountModule } from '../../../src/account/account.module';
import { FirebaseModule } from '../../../src/firebase/firebase.module';
import { TasksService } from '../../../src/tasks/tasks.service';

describe('TaskService', () => {
  let taskService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FirebaseModule, AccountModule],
      providers: [TasksService],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });
});