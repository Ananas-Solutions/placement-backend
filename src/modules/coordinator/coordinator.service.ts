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

import { CreateCoordinatorDto } from './dto';
import { ICoordinatorCollegeDepartmentResponse } from './response';

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

    await this.coordinatorDepartment.save({
      user: { id: coordinatorUser.id } as UserEntity,
      department: { id: departmentId } as CollegeDepartmentEntity,
    });

    return { message: 'Coordinator added successfully.' };
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

  // async saveProfile(
  //   id: string,
  //   body: CoordinatorProfileDto,
  // ): Promise<CoordinatorProfile> {
  //   try {
  //     const user = await this.userService.findUserById(id);
  //     if (!user || user.role !== UserRole.CLINICAL_COORDINATOR)
  //       throw new NotFoundException('Coordinator not found');
  //     return await this.coordinatorRepository.save({
  //       ...body,
  //       user,
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async getProfile(id: string): Promise<CoordinatorProfile> {
  //   try {
  //     return await this.coordinatorRepository.findOne({
  //       where: { user: id },
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async updateProfile(
  //   id: string,
  //   body: CoordinatorProfileDto,
  // ): Promise<CoordinatorProfile> {
  //   try {
  //     const user = await this.userService.findUserById(id);
  //     if (!user || user.role !== UserRole.CLINICAL_COORDINATOR)
  //       throw new NotFoundException('Coordinator not found');
  //     const profile = await this.coordinatorRepository.findOne({
  //       where: { user: id },
  //     });
  //     return await this.coordinatorRepository.save({
  //       ...profile,
  //       ...body,
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // async getAllUnassignedCoordinator(): Promise<any> {
  //   try {
  //     const coordinators = await this.userService.findAllSpecifcUser(
  //       UserRoleEnum.CLINICAL_COORDINATOR,
  //     );
  //     const allCourseCoordinator = await this.courseRepository.find({
  //       relations: ['coordinator'],
  //     });
  //     const courseCoordinatorIds = allCourseCoordinator.map(
  //       (c) => c.coordinator.id,
  //     );
  //     const unassignedCoordinators = coordinators.map((coordinator) => {
  //       if (!courseCoordinatorIds.includes(coordinator.id)) {
  //         return coordinator;
  //       }
  //     });
  //     return unassignedCoordinators.filter(Boolean);
  //   } catch (err) {
  //     throw err;
  //   }
  // }

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
