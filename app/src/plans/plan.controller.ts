import { Body, Controller, HttpException, HttpStatus, Post, Get, Param, Put } from 'test/e2e/plans/node_modules/@nestjs/common';
import { planService } from './plan.service';
import { FamilyAndPlansDto } from './dto/family-and-plans.dto'
import { PlanDto } from './dto/plan.dto';

@Controller('api/plans')
export class PlanController {
  @Post()
  async create(@Body() familyAndPlansDto: FamilyAndPlansDto) {
    try {
      return await planService.createPlans(familyAndPlansDto);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'The input data is invalid ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }

  @Get(':id')
  async findPlans(@Param('id') id: number): Promise<any> {
    var result = [];
    try {
      result = await planService.getPlansByFamilyId(id);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred retrieving the data ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
    if (result.length === 0) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'No data for family: ' + id,
      }, HttpStatus.NOT_FOUND);
    }
    return result;
  }

  @Put(':id')
  async updatePlans(@Param('id') id: number, @Body() updatePlan: PlanDto) {
    try {
      return await planService.updatePlanById(id, updatePlan);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred updating plan ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }
}
