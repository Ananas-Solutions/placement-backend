import { Injectable } from '@nestjs/common';

import { UserRoleEnum } from 'commons/enums';
import { ISuccessMessageResponse } from 'commons/response';
import {
  PlacementEntity,
  StudentProfileEntity,
  UserEntity,
} from 'entities/index.entity';
import { FileUploadService } from 'helper/file-uploader.service';
import { StudentCourseService } from 'student-course/student-course.service';
import { UserService } from 'user/user.service';
import { IUserResponse } from 'user/response';
import {
  PlacementRepositoryService,
  StudentProfileRepositoryService,
} from 'repository/services';

import {
  CreateBulkStudentDto,
  CreateStudentDto,
  StudentProfileDto,
} from './dto/';
import {
  IStudentProfileResponse,
  IStudentTrainingTimeSlotsResponse,
} from './response';

@Injectable()
export class StudentService {
  constructor(
    private readonly studentProfileRepository: StudentProfileRepositoryService,
    private readonly placementRepository: PlacementRepositoryService,
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
      { conflictPaths: { user: true } },
    );
    await this.userService.updateUser(id, { name });

    return { message: 'Profile updated successfully.' };
  }

  async getProfile(id: string): Promise<IStudentProfileResponse> {
    const student = await this.userService.findUserById(id);
    const studentProfile = await this.studentProfileRepository.findOne(
      {
        user: { id },
      },
      { user: true },
    );

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
    const studentPlacement = await this.placementRepository.findMany(
      {
        student: { id: studentId },
      },
      {
        trainingSite: { departmentUnit: { department: { hospital: true } } },
        timeSlot: { supervisor: true },
      },
    );

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
        imageUrl: '',
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
    const { id, trainingSite, timeSlot } = placement;
    const { course } = trainingSite;
    const { startTime, endTime, day, supervisor, id: timeslotId } = timeSlot;

    const { departmentUnit } = trainingSite;
    const { department } = departmentUnit;
    const { hospital } = department;

    return {
      placementId: id,
      hospital: hospital.name,
      department: department.name,
      departmentUnit: departmentUnit.name,
      supervisor: {
        name: supervisor.name,
        email: supervisor.email,
        id: supervisor.id,
      },
      course: {
        name: course.name,
        id: course.id,
      },
      trainingSite: {
        id: trainingSite.id,
      },
      timeslotId,
      startTime,
      endTime,
      day,
    };
  }
}
