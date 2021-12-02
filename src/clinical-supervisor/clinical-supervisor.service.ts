import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HospitalService } from 'src/hospital/hospital.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { SupervisorProfileDto } from './dto/clinicalSupervisorProfile.dto';
import { SupervisorProfile } from './entity/clinicalSupervisorProfile.entity';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorProfile)
    private readonly supervisorProfileRepository: Repository<SupervisorProfile>,

    private readonly userService: UserService,
    private readonly hospitalService: HospitalService,
  ) {}

  async saveSupervisorProfile(
    userId: string,
    body: any,
  ): Promise<SupervisorProfile> {
    try {
      const user = await this.userService.findUserById(userId);
      const hospital = await this.hospitalService.findOneHospital(
        body.hospital,
      );
      const department = await this.hospitalService.findOneDepartment(
        body.department,
      );
      return await this.supervisorProfileRepository.save({
        ...body,
        user,
        hospital,
        department,
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateSupervisorProfile(
    userId: string,
    body: SupervisorProfileDto,
  ): Promise<SupervisorProfile> {
    try {
      const supervisorProfile = await this.supervisorProfileRepository.findOne({
        where: { user: userId },
      });
      return;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
