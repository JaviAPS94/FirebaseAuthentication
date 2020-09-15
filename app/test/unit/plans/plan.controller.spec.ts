import { HttpException, HttpStatus } from 'test/e2e/plans/node_modules/@nestjs/common';
import { Test, TestingModule } from 'test/e2e/plans/node_modules/@nestjs/testing';
import { mockPlans } from '../../mock-plan-data';
import { PlanController } from '../../../src/plans/plan.controller';
import { PlanService } from '../../../src/plans/plan.service';
import { FamilyAndPlansDto } from '../../../src/plans/dto/family-and-plans.dto'

describe('Transaction Controller', () => {
  let transactionController: PlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
      providers: [PlanService],
    }).compile();
    transactionController = module.get<PlanController>(PlanController);
  });

  it('POST should return 201 when post data is Ok', async () => {
    const createPlans = PlanService.prototype.createPlans = jest.fn();
    createPlans.mockReturnValue([mockPlans.plans[0], mockPlans.plans[1]]);
    const familyAndPlansDto = new FamilyAndPlansDto();
    Object.assign(familyAndPlansDto, mockPlans);
    
    const returnedValue = await transactionController.create(familyAndPlansDto);
    expect(createPlans).toHaveBeenCalled();
    expect(returnedValue).toEqual([mockPlans.plans[0], mockPlans.plans[1]]);
  });

  it('POST should return 403 when data to post is invalid', async () => {
    const createBatch = PlanService.prototype.createPlans = jest.fn();
    createBatch.mockImplementation(() => {
      throw new Error('error');
    });
    const familyAndPlansDto = new FamilyAndPlansDto();
    Object.assign(familyAndPlansDto, mockPlans);
    expect.assertions(3);

    try{
      await transactionController.create(familyAndPlansDto);
    }catch (error){
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('The input data is invalid');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }

  });

  it('GET should return 200 when get plans is OK', async () => {
    const getPlansByFamilyId = PlanService.prototype.getPlansByFamilyId = jest.fn();
    getPlansByFamilyId.mockReturnValue(mockPlans.plans);
    const expectedResult = mockPlans.plans
    
    const returnedValue = await transactionController.findPlans(1);
    expect(getPlansByFamilyId).toHaveBeenCalled();
    expect(returnedValue).toEqual(expectedResult);
  });

  it('GET should return 403 when it cannnot retrieve data', async () => {
    const getPlansByFamilyId = PlanService.prototype.getPlansByFamilyId = jest.fn();
    getPlansByFamilyId.mockImplementation(() => {
      throw new Error('error');
    });
    expect.assertions(3);

    try{
      await transactionController.findPlans(2);
    }catch (error){
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred retrieving the data');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }
  });

  it('GET should return 404 when it cannnot retrieve data', async () => {
    const getPlansByFamilyId = PlanService.prototype.getPlansByFamilyId = jest.fn();
    getPlansByFamilyId.mockReturnValue([]);
    expect.assertions(3);

    try{
      await transactionController.findPlans(2);
    }catch (error){
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('No data for family:');
      expect(error.status).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('PUT should return 200 when get plans is OK', async () => {
    const updatePlanById = PlanService.prototype.updatePlanById = jest.fn();
    updatePlanById.mockReturnValue(mockPlans.plans[0]);
    const expectedResult = mockPlans.plans[0]
    const planIdForUpdate = 1;

    const returnedValue = await transactionController.updatePlans(planIdForUpdate, mockPlans.plans[0]);

    expect(updatePlanById).toHaveBeenCalledWith(1, mockPlans.plans[0]);
    expect(returnedValue).toEqual(expectedResult);
  });

  it('PUT should return 403 when it cannnot retrieve data', async () => {
    const updatePlanById = PlanService.prototype.updatePlanById = jest.fn();
    const planIdForUpdate = 1;
    updatePlanById.mockImplementation(() => {
      throw new Error('error');
    });
    expect.assertions(3);

    try{
      await transactionController.updatePlans(planIdForUpdate, mockPlans.plans[0]);
    }catch (error){
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred updating plan');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }
  });
});
