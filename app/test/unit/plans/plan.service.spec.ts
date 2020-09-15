import { Test, TestingModule } from 'test/e2e/plans/node_modules/@nestjs/testing';
import { PlanService } from '../../../src/plans/plan.service';
import { Plan } from '../../../src/entity/Plan';
import { mockPlans } from '../../mock-plan-data';
import { FamilyPlanService } from '../../../src/plans/family-plan.service';
import { EntityManagerWrapperService } from '../../../src/utils/entity-manager-wrapper.service';

jest.mock('../../../src/utils/entity-manager-wrapper.service');

describe('PlanService', () => {
    let planService: PlanService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanService],
    }).compile();

    planService = module.get<PlanService>(PlanService);
  });

  it('should insert plan in db', async () => {
    mockCreatePlanSuccessful();
    const returnedFamilyPlan = mockFindFamilyByExternalId();
    const dataToCreate = mockPlans.plans[1];
    const PlanWithRealFamilyPlanId = new Plan();
    Object.assign(PlanWithRealFamilyPlanId, mockPlans.plans[1]);
    PlanWithRealFamilyPlanId.familyPlanId = mockPlans.familyPlans[0].id;

    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.create(dataToCreate, wrapperService);
    
    expect(result).toEqual(PlanWithRealFamilyPlanId);
    expect(result.familyPlanId).toEqual(mockPlans.familyPlans[0].id);
    expect(returnedFamilyPlan).toHaveBeenLastCalledWith(mockPlans.familyPlans[0].externalId, wrapperService);
    expect(wrapperService.save).toHaveBeenCalledWith(PlanWithRealFamilyPlanId);
  });

  it('should throw error when create fails', async () => {
    mockCreatePlanFailure();
    const dataToCreate = mockPlans.plans[0];
    const wrapperService = new EntityManagerWrapperService();
    expect.assertions(2);

    try{
      await planService.create(dataToCreate, wrapperService);
    }catch(error){
      expect(error.message).toContain('Plan Database Error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should throw error when findById is empty', async () => {
    mockFindFamilyByExternalIdEmpty();
    const dataToCreate = mockPlans.plans[1];
    const wrapperService = new EntityManagerWrapperService();
    expect.assertions(2);

    try{
      await planService.create(dataToCreate, wrapperService);
    }catch(error){
      expect(error.message).toContain('Plan needs a VALID FamilyPlanId');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should insert plan array in db', async () => {
    mockFindFamilyByExternalId();
    const createPlan = mockCreatePlan();
    const dataToCreate = mockPlans.plans;
    const expectedResult = [mockPlans.plans[0],mockPlans.plans[1]];

    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.createBatch(dataToCreate, wrapperService);
  
    expect(result).toEqual(expectedResult);
    expect(createPlan).toHaveBeenNthCalledWith(1, mockPlans.plans[0], wrapperService);
    expect(createPlan).toHaveBeenNthCalledWith(2, mockPlans.plans[1], wrapperService);
  });

  it('should return an empty array when plans is undefined', async () => {
    const dataToCreate = undefined;
    const expectedResult = [];
  
    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.createBatch(dataToCreate, wrapperService);
  
    expect(result).toEqual(expectedResult);
  });

  it('should return a plan list by familyId', async () => {
    mockFindByFamilyIdReturnedValue();
    const familyPlanId = 1;
    const expectedResult = mockPlans.plans;
  
    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.findPlansByFamilyId(familyPlanId, wrapperService);
  
    expect(result).toEqual(expectedResult);
  });

  it('should throw error when find ByFamilyId fails', async () => {
    mockFindByFamilyIdFailure();
    const familyId = 2;
    const wrapperService = new EntityManagerWrapperService();
    expect.assertions(2);

    try{
      await planService.findPlansByFamilyId(familyId, wrapperService);
    }catch(error){
      expect(error.message).toContain('FamilyPlan Find error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should return an empty array when familyPlanId does not exists', async () => {
    mockFindByFamilyIdEmpty();
    const familyId = 3;
    const expectedResult = [];

    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.findPlansByFamilyId(familyId, wrapperService);

    expect(result).toEqual(expectedResult);
  });

  it('should return a plan by PlanId', async () => {
    mockFindByPlanIdReturnedValue();
    const PlanId = 1;
    const expectedResult = mockPlans.plans[1];
  
    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.findPlanById(PlanId, wrapperService);
  
    expect(result).toEqual(expectedResult);
  });

  it('should throw error when find ById fails', async () => {
    mockFindByIdFailure();
    const familyId = 2;
    expect.assertions(2);

    try{
      const wrapperService = new EntityManagerWrapperService();
      await planService.findPlanById(familyId, wrapperService);
    }catch(error){
      expect(error.message).toContain('PlanById Find error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should return an empty object when PlanId does not exists', async () => {
    mockFindByIdEmpty();
    const familyId = 3;
    const expectedResult = {};

    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.findPlanById(familyId, wrapperService);

    expect(result).toEqual(expectedResult);
  });

  it('should update a plan in db', async () => {
    mockUpdatePlanSuccessful();
    const dataToCreate = new Plan();
    Object.assign(dataToCreate, mockPlans.plans[1]);
    const expectedResult = new Plan();
    Object.assign(expectedResult, mockPlans.plans[1]);

    const wrapperService = new EntityManagerWrapperService();
    const result =  await planService.updatePlan(dataToCreate, wrapperService);
    
    expect(result).toEqual(expectedResult);
    expect(wrapperService.save).toHaveBeenCalledWith(expectedResult);
  });

  it('should throw error when save fails', async () => {
    mockCreatePlanFailure();
    const dataToCreate = new Plan();
    Object.assign(dataToCreate, mockPlans.plans[1]);
    expect.assertions(2);

    try{
      const wrapperService = new EntityManagerWrapperService();
      await planService.updatePlan(dataToCreate, wrapperService);
    }catch(error){
      expect(error.message).toContain('Update Plan Database Error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

});

const mockCreatePlanSuccessful = () => {
  const returnedPlan = new Plan();
  Object.assign(returnedPlan, mockPlans.plans[1]);
  returnedPlan.familyPlanId = mockPlans.familyPlans[0].id;

  const save = EntityManagerWrapperService.prototype.save = jest.fn();
  save.mockReturnValue(returnedPlan);
};

const mockCreatePlanFailure = () => {
  const save = EntityManagerWrapperService.prototype.save = jest.fn();
  save.mockImplementation(()=> { throw new Error('ANY.ERROR') });
};

const mockCreatePlan = () => {
  const create = PlanService.prototype.create = jest.fn();
  return create
  .mockResolvedValueOnce(mockPlans.plans[0])
  .mockResolvedValueOnce(mockPlans.plans[1]);
};

const mockFindFamilyByExternalId = () => {
  const findByExternalId = FamilyPlanService.prototype.findByExternalId = jest.fn();
  return findByExternalId.mockReturnValue([mockPlans.familyPlans[0]]);
};

const mockFindFamilyByExternalIdEmpty = () => {
  const findByExternalId = FamilyPlanService.prototype.findByExternalId = jest.fn();
  return findByExternalId.mockReturnValue([]);
};

const mockFindByFamilyIdReturnedValue = () => {
  const findPlansByFamilyId = EntityManagerWrapperService.prototype.findPlansByFamilyId = jest.fn();
  findPlansByFamilyId.mockReturnValue(mockPlans.plans);
};

const mockFindByFamilyIdFailure = () => {
  const findPlansByFamilyId = EntityManagerWrapperService.prototype.findPlansByFamilyId = jest.fn();
  findPlansByFamilyId.mockImplementation(()=> { throw new Error('ANY.ERROR') });
};

const mockFindByFamilyIdEmpty = () => {
  const findByFamilyId = EntityManagerWrapperService.prototype.findPlansByFamilyId = jest.fn();
  findByFamilyId.mockReturnValue([]);
};

const mockFindByPlanIdReturnedValue = () => {
  const findByPlanId = EntityManagerWrapperService.prototype.findPlanById = jest.fn();
  findByPlanId.mockReturnValue(mockPlans.plans[1]);
};

const mockFindByIdEmpty = () => {
  const findByFamilyId = EntityManagerWrapperService.prototype.findPlanById = jest.fn();
  findByFamilyId.mockReturnValue({});
};

const mockFindByIdFailure = () => {
  const findByPlanId = EntityManagerWrapperService.prototype.findPlanById = jest.fn();
  findByPlanId.mockImplementation(()=> { throw new Error('ANY.ERROR') });
};

const mockUpdatePlanSuccessful = () => {
  const returnedPlan = new Plan();
  Object.assign(returnedPlan, mockPlans.plans[1]);
  const save = EntityManagerWrapperService.prototype.save = jest.fn();
  save.mockReturnValue(returnedPlan);
};
