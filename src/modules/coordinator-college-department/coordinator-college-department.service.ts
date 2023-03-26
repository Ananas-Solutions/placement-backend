// import { ConflictException, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CollegeDepartmentService } from 'src/college-department/college-department.service';
// import { UserRole } from 'src/user/types/user.role';
// import { UserService } from 'src/user/user.service';
// import { Repository } from 'typeorm';
// import { CoordinatorCollegeDepartment } from '../../entities/coordinator-college-department.entity';

// @Injectable()
// export class CoordinatorCollegeDepartmentService {
//   constructor(
//     @InjectRepository(CoordinatorCollegeDepartment)
//     private readonly coordinatorDepartmentRepository: Repository<CoordinatorCollegeDepartment>,
//     @InjectRepository(Coor)
//     private readonly userService: UserService,
//     private readonly departmentService: CollegeDepartmentService,
//   ) {}

//   async saveDepartments(
//     id: string,
//     departments: string[],
//   ): Promise<{ message: string }> {
//     try {
//       const user = await this.userService.findUserById(id);
//       if (!user || user.role !== UserRole.CLINICAL_COORDINATOR)
//         throw new ConflictException('User is not coordinator');
//       await Promise.all(
//         departments.map(async (departmentId: string) => {
//           const department = await this.departmentService.findOne(departmentId);
//           return await this.coordinatorDepartmentRepository.save({
//             user,
//             department,
//           });
//         }),
//       );
//       return { message: 'Departments assigned successfully' };
//     } catch (err) {
//       throw err;
//     }
//   }

//   async findDepartments(
//     coordinatorId: string,
//   ): Promise<CoordinatorCollegeDepartment[]> {
//     try {
//       return await this.coordinatorDepartmentRepository.find({
//         where: { user: coordinatorId },
//         relations: ['department'],
//       });
//     } catch (err) {
//       throw err;
//     }
//   }

//   async findCoordinators(
//     departmentId: string,
//   ): Promise<CoordinatorCollegeDepartment[]> {
//     try {
//       return await this.coordinatorDepartmentRepository.find({
//         where: { department: departmentId },
//         relations: ['user'],
//       });
//     } catch (err) {
//       throw err;
//     }
//   }
// }
