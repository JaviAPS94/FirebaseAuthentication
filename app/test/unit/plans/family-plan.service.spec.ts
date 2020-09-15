import { Test, TestingModule } from 'test/e2e/plans/node_modules/@nestjs/testing';
import { FamilyPlanService } from '../../../src/plans/family-plan.service';
import { FamilyPlan } from '../../../src/entity/FamilyPlan';
import { mockPlans } from '../../mock-plan-data';
import { EntityManagerWrapperService } from '../../../src/utils/entity-manager-wrapper.service';

jest.mock('../../../src/utils/entity-manager-wrapper.service');

describe('FamilyPlanService', () => {
  let familyPlanService: FamilyPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FamilyPlanService],
    }).compile();

    familyPlanService = module.get<FamilyPlanService>(FamilyPlanService);
  });

  it('should insert family-plan in db', async () => {
    mockCreateFamilyPlanSuccessful();
    const dataToCreate = mockPlans.familyPlans[0];
    const expectedResult = new FamilyPlan();
    Object.assign(expectedResult, dataToCreate);

    const entityManagerWrapperService = new EntityManagerWrapperService();
    const result =  await familyPlanService.create(dataToCreate, entityManagerWrapperService);
    
    expect(result).toEqual(expectedResult);
    expect(entityManagerWrapperService.save).toHaveBeenCalledWith(dataToCreate);
  });

  it('should throw error when family-plan save fails', async () => {
    mockCreateFamilyPlanFailure();
    const dataToCreate = mockPlans.familyPlans[0];
    expect.assertions(2);
  
    try{
      const entityManagerWrapperService = new EntityManagerWrapperService();
      await familyPlanService.create(dataToCreate, entityManagerWrapperService);
    }catch(error){
      expect(error.message).toContain('FamilyPlan Database Error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should insert family-plan array in db', async () => {
    mockCreateBatchFamilyPlan();
    const dataToCreate = mockPlans.familyPlans;
    const expectedResult = [mockPlans.familyPlans[0].id,mockPlans.familyPlans[1].id];

    const entityManagerWrapperService = new EntityManagerWrapperService();
    const result =  await familyPlanService.createBatch(dataToCreate, entityManagerWrapperService);
  
    expect(result).toEqual(expectedResult);
    expect(entityManagerWrapperService.save).toHaveBeenNthCalledWith(1,mockPlans.familyPlans[0]);
    expect(entityManagerWrapperService.save).toHaveBeenNthCalledWith(2,mockPlans.familyPlans[1]);
  });

  it('should return an empty array when familyPlans is undefined', async () => {
    const dataToCreate = undefined;
    const expectedResult = [];

    const entityManagerWrapperService = new EntityManagerWrapperService();
    const result =  await familyPlanService.createBatch(dataToCreate, entityManagerWrapperService);

    expect(result).toEqual(expectedResult);
  });

  it('should get familyPlan Id from familyExternalId', async () => {
    mockFindByExternalId();

    const entityManagerWrapperService = new EntityManagerWrapperService();
    const result =  await familyPlanService.findByExternalId(mockPlans.familyPlans[0].externalId, entityManagerWrapperService);
    const findParameter = {
      where: { externalId: "TEST"}
    };

    expect(entityManagerWrapperService.findFamily).toHaveBeenCalledWith(findParameter);
    expect(result).toEqual([mockPlans.familyPlans[0]]);
  });

  it('should throw error when family-plan FindByExternalId fails', async () => {
    mockFindByExternalIdFailure();
    expect.assertions(2);

    try{
      const entityManagerWrapperService = new EntityManagerWrapperService();
      await familyPlanService.findByExternalId(mockPlans.familyPlans[0].externalId, entityManagerWrapperService);
    }catch(error){
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toContain("FamilyPlan Find error:");
    }
  });

});

const mockCreateFamilyPlanSuccessful = () => {
  const returnedFamilyPlan = new FamilyPlan();
  Object.assign(returnedFamilyPlan, mockPlans.familyPlans[0] );
  const save = EntityManagerWrapperService.prototype.save = jest.fn();
  save.mockReturnValue(returnedFamilyPlan);
};

const mockCreateFamilyPlanFailure = () => {
  const save = EntityManagerWrapperService.prototype.save = jest.fn();
  save.mockImplementation(()=> { throw new Error('ANY.ERROR') });
};

const mockCreateBatchFamilyPlan = () => {
  const save = EntityManagerWrapperService.prototype.save = jest.fn();
  save.mockResolvedValueOnce(mockPlans.familyPlans[0]).mockResolvedValueOnce(mockPlans.familyPlans[1]);
};

const mockFindByExternalId = () => {
  const findFamily = EntityManagerWrapperService.prototype.findFamily = jest.fn();
  findFamily.mockReturnValue([mockPlans.familyPlans[0]]);
};

const mockFindByExternalIdFailure = () => {
  const findFamily = EntityManagerWrapperService.prototype.findFamily = jest.fn();
  findFamily.mockImplementation(() => { throw new Error('ANY.ERROR')});
};
