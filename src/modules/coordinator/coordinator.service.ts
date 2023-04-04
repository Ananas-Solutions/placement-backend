import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { CoordinatorCollegeDepartmentEntity } from 'entities/coordinator-college-department.entity';
import { UserEntity } from 'entities/user.entity';
import { CollegeDepartmentEntity } from 'entities/college-department.entity';
import { CoordinatorProfileEntity } from 'entities/coordinator-profile.entity';
import { CourseEntity } from 'entities/courses.entity';
import { UserService } from 'user/user.service';

import { CreateCoordinatorDto, UpdateCoordinatorDto } from './dto';
import {
  ICoordinatorCollegeDepartmentResponse,
  ICoordinatorResponse,
} from './response';

@Injectable()
export class CoordinatorService {
  constructor(
    @InjectRepository(CoordinatorProfileEntity)
    private readonly coordinatorProfileRepository: Repository<CoordinatorProfileEntity>,
    @InjectRepository(CoordinatorCollegeDepartmentEntity)
    private readonly coordinatorDepartment: Repository<CoordinatorCollegeDepartmentEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly userService: UserService,
  ) {}

  async saveCoordinator(
    body: CreateCoordinatorDto,
  ): Promise<ISuccessMessageResponse> {
    const { name, email, departmentId } = body;

    const coordinatorUser = await this.userService.saveUser({
      name,
      email,
      role: UserRoleEnum.CLINICAL_COORDINATOR,
      password: `uos@${email}`,
    });

    if (departmentId) {
      await this.coordinatorDepartment.save({
        coordinator: { id: coordinatorUser.id } as UserEntity,
        department: { id: departmentId } as CollegeDepartmentEntity,
      });
    }

    return { message: 'Coordinator added successfully.' };
  }

  async getAllCoordinators(): Promise<ICoordinatorResponse[]> {
    const allCoordinators = await this.userService.findAllSpecificUser(
      UserRoleEnum.CLINICAL_COORDINATOR,
    );
    const result = await Promise.all(
      allCoordinators.map(async (coordinator) => {
        const coordinatorDepartment = await this.coordinatorDepartment.findOne({
          where: { coordinator: { id: coordinator.id } },
          relations: ['department'],
        });
        const { id, name, email } = coordinator;
        return {
          id,
          name,
          email,
          department: {
            id: coordinatorDepartment?.department?.id,
            name: coordinatorDepartment?.department?.name,
          },
        };
      }),
    );
    return result;
  }

  async findCoordinator(coordinatorId: string) {
    const coordinator = await this.userService.findUserById(coordinatorId);
    const coordinatorDepartment = await this.coordinatorDepartment.findOne({
      where: { coordinator: { id: coordinatorId } },
      relations: ['department'],
    });
    return {
      ...coordinator,
      department: {
        id: coordinatorDepartment?.department?.id,
        name: coordinatorDepartment?.department?.name,
      },
    };
  }

  async findCoordinatorCourse(coordinatorId: string): Promise<any> {
    return await this.courseRepository.findOne({
      where: { coordinator: { id: coordinatorId } },
      relations: ['department', 'semester'],
    });
  }

  async findCoordinatorDepartment(coordinatorId: string) {
    const coordinatorDepartment = await this.coordinatorDepartment.findOne({
      where: { coordinator: { id: coordinatorId } },
      relations: ['department'],
    });

    return this.transformToDepartmentResponse(coordinatorDepartment);
  }

  async updateCoordinator(
    coordinatorId: string,
    body: UpdateCoordinatorDto,
  ): Promise<ISuccessMessageResponse> {
    const { departmentId, ...rest } = body;

    if (departmentId) {
      const existingCoordinatorDepartment =
        await this.coordinatorDepartment.findOne({
          where: {
            coordinator: { id: coordinatorId },
            department: { id: departmentId },
          },
        });

      if (existingCoordinatorDepartment) {
        await this.coordinatorDepartment.update(
          existingCoordinatorDepartment.id,
          {
            department: { id: departmentId } as CollegeDepartmentEntity,
          },
        );
      }

      if (!existingCoordinatorDepartment) {
        await this.coordinatorDepartment.save({
          coordinator: { id: coordinatorId },
          department: { id: departmentId } as CollegeDepartmentEntity,
        });
      }
    }

    await this.userService.updateUser(coordinatorId, { name: rest.name });

    return { message: 'Coordinator updated successfully.' };
  }

  async deleteCoordinator(
    coordinatorId: string,
  ): Promise<ISuccessMessageResponse> {
    await this.userService.deleteUser(coordinatorId);

    const coordinatorDepartment = await this.coordinatorDepartment.findOne({
      where: {
        coordinator: { id: coordinatorId },
      },
    });

    await this.coordinatorDepartment.softRemove(coordinatorDepartment);

    return { message: 'Coordinator removed successfully.' };
  }

  private transformToDepartmentResponse(
    entity: CoordinatorCollegeDepartmentEntity,
  ): ICoordinatorCollegeDepartmentResponse {
    const { id, name } = entity.department;

    return {
      departmentId: id,
      departmentName: name,
    };
  }
}
