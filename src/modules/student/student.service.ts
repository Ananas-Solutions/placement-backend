import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import { PlacementEntity } from 'entities/placement.entity';
import { StudentProfileEntity } from 'entities/student-profile.entity';
import { UserEntity } from 'entities/user.entity';
import { StudentCourseService } from 'student-course/student-course.service';
import { UserService } from 'user/user.service';

import {
  CreateBulkStudentDto,
  CreateStudentDto,
  StudentProfileDto,
} from './dto/';
import {
  IStudentProfileResponse,
  IStudentTrainingTimeSlotsResponse,
} from './response';
import { IUserResponse } from 'user/response';
import { FileUploadService } from 'helper/file-uploader.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentProfileEntity)
    private readonly studentProfileRepository: Repository<StudentProfileEntity>,
    @InjectRepository(PlacementEntity)
    private readonly placementRepository: Repository<PlacementEntity>,
    private readonly userService: UserService,
    private readonly studentCourseService: StudentCourseService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async saveStudent(body: CreateStudentDto) {
    const studentUser = await this.userService.saveUser({
      email: body.email.trim().toLowerCase(),
      name: body.name,
      role: UserRoleEnum.STUDENT,
      password: 'student',
      studentId: body.studentId.trim().toLowerCase(),
    });

    return studentUser;
  }

  async saveBulkStudent(body: CreateBulkStudentDto): Promise<any> {
    const allStudents = await Promise.all(
      body.students.map(async (student: CreateStudentDto) => {
        const foundStudent = await this.userService.findUserByEmail(
          student.email.trim().toLowerCase(),
        );
        if (foundStudent) {
          return foundStudent;
        }
        const studentUser = await this.saveStudent({
          email: student.email.trim().toLowerCase(),
          name: student.name,
          studentId: student.studentId.trim().toLowerCase(),
        });

        return studentUser;
      }),
    );

    const mappedStudents = allStudents.map((student: UserEntity) => student.id);
    await this.studentCourseService.assignStudents({
      courseId: body.courseId,
      studentsId: mappedStudents,
      blockId: body.blockId,
    });

    return { message: 'Student uploaded successfully.' };
  }

  async updateProfile(
    id: string,
    body: StudentProfileDto,
  ): Promise<ISuccessMessageResponse> {
    const { name, ...profileData } = body;
    await this.studentProfileRepository.upsert(
      {
        ...profileData,
        user: { id } as UserEntity,
      },
      ['user'],
    );
    await this.userService.updateUser(id, { name });

    return { message: 'Profile updated successfully.' };
  }

  async getProfile(id: string): Promise<IStudentProfileResponse> {
    const student = await this.userService.findUserById(id);
    const studentProfile = await this.studentProfileRepository.findOne({
      where: { user: { id } },
      loadEagerRelations: false,
      relations: {
        user: true,
      },
    });

    return this.transformToResponse(student, studentProfile);
  }

  async updateProfileAvatar(
    userId: string,
    avatarUrl: string,
  ): Promise<ISuccessMessageResponse> {
    await this.studentProfileRepository.update(
      { user: { id: userId } },
      {
        imageUrl: avatarUrl,
      },
    );

    return { message: 'Profile avatar updated successfully.' };
  }

  async getStudentTimeSlots(
    studentId: string,
  ): Promise<IStudentTrainingTimeSlotsResponse[]> {
    const studentPlacement = await this.placementRepository.find({
      where: {
        student: { id: studentId },
        deletedAt: IsNull(),
      },
      loadEagerRelations: false,
      relations: {
        trainingSite: {
          departmentUnit: {
            department: {
              hospital: true,
            },
          },
          course: {
            courseCoordinator: {
              coordinator: true,
            },
            department: true,
            semester: true,
          },
        },
        timeSlot: {
          supervisor: true,
        },
        blockTrainingSite: {
          departmentUnit: {
            department: {
              hospital: true,
            },
          },
          block: {
            course: {
              courseCoordinator: {
                coordinator: true,
              },
            },
          },
        },
        blockTimeSlot: {
          supervisor: true,
        },
      },
    });

    const mappedResult = studentPlacement.map((placement) =>
      this.transformToTimeSlotResponse(placement),
    );

    return mappedResult;
  }

  private async transformToResponse(
    student: IUserResponse,
    profile: StudentProfileEntity,
  ): Promise<IStudentProfileResponse> {
    if (!profile) {
      return {
        userId: student.id,
        name: student.name,
        email: student.email.trim().toLowerCase(),
        studentId: student.studentId.trim().toLowerCase(),
        alternateEmail: null,
        phone: null,
        alternatePhone: null,
        gender: null,
        dob: null,
        address: null,
        // address: {
        //   address1: null,
        //   address2: null,
        //   city: null,
        //   state: null,
        //   country: null,
        //   postalCode: null,
        // },
        kin: null,
        imageUrl: profile?.imageUrl
          ? await this.fileUploadService.getUploadedFile(profile?.imageUrl)
          : null,
      };
    }

    const {
      gender,
      dob,
      address1,
      address2,
      city,
      postalCode,
      state,
      country,
      address,
      kin,
      user,
      alternateEmail,
      alternatePhone,
      phone,
    } = profile;

    return {
      userId: user.id,
      name: user.name,
      email: user.email.trim().toLowerCase(),
      studentId: user.studentId.trim().toLowerCase(),
      alternateEmail,
      phone,
      alternatePhone,
      gender,
      dob,
      address,
      // address: {
      //   address1,
      //   address2,
      //   city,
      //   state,
      //   country,
      //   postalCode,
      // },
      kin,
      imageUrl: profile?.imageUrl
        ? await this.fileUploadService.getUploadedFile(profile.imageUrl)
        : null,
    };
  }

  private transformToTimeSlotResponse(placement: PlacementEntity) {
    try {
      const {
        id,
        trainingSite,
        timeSlot,
        blockTrainingSite,
        blockTimeSlot,
        placementDate,
      } = placement;

      let course;
      if (blockTrainingSite) {
        course = blockTrainingSite.block.course;
      } else {
        course = trainingSite.course;
      }

      const {
        startTime,
        endTime,
        day,
        supervisor,
        id: timeslotId,
      } = blockTimeSlot || timeSlot;

      const { departmentUnit } = blockTrainingSite || trainingSite;
      const { department } = departmentUnit;
      const { hospital } = department;

      const courseCoordinators = course.courseCoordinator.map(
        (courseCoordinator) => {
          const { coordinator } = courseCoordinator;

          return {
            id: coordinator.id,
            name: coordinator.name,
            email: coordinator.email?.trim().toLowerCase(),
          };
        },
      );

      return {
        placementId: id,
        placementDate,
        hospital: {
          id: hospital.id,
          name: hospital.name,
          location: hospital.location,
        },
        department: department.name,
        departmentUnit: departmentUnit.name,
        supervisor: {
          name: supervisor?.name,
          email: supervisor?.email?.trim().toLowerCase(),
          id: supervisor?.id,
        },
        course: {
          name: course?.name,
          id: course?.id,
          coordinators: courseCoordinators,
          department: course?.department?.name,
          semester: {
            startYear: course?.semester?.startYear,
            endYear: course?.semester?.endYear,
            semester: course?.semester?.semester,
          },
        },
        trainingSite: {
          id: (blockTrainingSite || trainingSite)?.id,
        },
        timeslotId,
        startTime,
        endTime,
        day,
      };
    } catch (error) {
      console.log('error', error);
    }
  }
}
