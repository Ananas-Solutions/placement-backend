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
      email: body.email,
      name: body.name,
      role: UserRoleEnum.STUDENT,
      password: 'student',
      studentId: body.studentId,
    });

    return studentUser;
  }

  async saveBulkStudent(body: CreateBulkStudentDto): Promise<any> {
    const allStudents = await Promise.all(
      body.students.map(async (student: CreateStudentDto) => {
        const foundStudent = await this.userService.findUserByEmail(
          student.email,
        );
        if (foundStudent) {
          return foundStudent;
        }
        const studentUser = await this.saveStudent({
          email: student.email,
          name: student.name,
          studentId: student.studentId,
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
      relations: ['user'],
    });

    // if (!studentProfile) {
    //   return;
    // }

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
      where: { student: { id: studentId }, deletedAt: IsNull() },
      loadEagerRelations: false,
      relations: {
        trainingSite: {
          departmentUnit: {
            department: {
              hospital: true,
            },
          },
          course: true,
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
            course: true,
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
        email: student.email,
        studentId: student.studentId,
        alternateEmail: null,
        phone: null,
        alternatePhone: null,
        gender: null,
        dob: null,
        address: {
          address1: null,
          address2: null,
          city: null,
          state: null,
          country: null,
          postalCode: null,
        },
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
      kin,
      user,
      alternateEmail,
      alternatePhone,
      phone,
    } = profile;

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      studentId: user.studentId,
      alternateEmail,
      phone,
      alternatePhone,
      gender,
      dob,
      address: {
        address1,
        address2,
        city,
        state,
        country,
        postalCode,
      },
      kin,
      imageUrl: await this.fileUploadService.getUploadedFile(profile.imageUrl),
    };
  }

  private transformToTimeSlotResponse(placement: PlacementEntity) {
    try {
      const { id, trainingSite, timeSlot, blockTrainingSite, blockTimeSlot } =
        placement;

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

      return {
        placementId: id,
        hospital: {
          id: hospital.id,
          name: hospital.name,
          location: hospital.location,
        },
        department: department.name,
        departmentUnit: departmentUnit.name,
        supervisor: {
          name: supervisor?.name,
          email: supervisor?.email,
          id: supervisor?.id,
        },
        course: {
          name: course?.name,
          id: course?.id,
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
