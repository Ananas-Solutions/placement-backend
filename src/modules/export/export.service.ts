import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as excel4node from 'excel4node';

import { AuthorityEntity } from 'entities/authority.entity';
import { HospitalEntity } from 'entities/hospital.entity';
import { DepartmentEntity } from 'entities/department.entity';
import { DepartmentUnitEntity } from 'entities/department-units.entity';

import { ExportDataDto } from './dto';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(AuthorityEntity)
    private readonly authorityRepository: Repository<AuthorityEntity>,
    @InjectRepository(HospitalEntity)
    private readonly hospitalRepository: Repository<HospitalEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(DepartmentUnitEntity)
    private readonly departmentUnitRepository: Repository<DepartmentUnitEntity>,
    private readonly configurationService: ConfigService,
  ) {}

  public async exportData(body: ExportDataDto) {
    const { data, length } = await this.mapData(body);
    await this.convertToExcel({ data, length });
  }

  private async mapData(body: ExportDataDto) {
    const whereClause: any = this.whereClause(body);

    if (body.departmentUnit) {
      const data = await this.authorityRepository.find({
        where: whereClause,
        loadEagerRelations: false,
        relations: {
          hospitals: {
            departments: {
              departmentUnits: true,
            },
          },
        },
      });

      return { data, length: 4 };
    }

    if (body.department) {
      const data = await this.authorityRepository.find({
        where: whereClause,
        loadEagerRelations: false,
        relations: {
          hospitals: {
            departments: true,
          },
        },
      });

      return { data, length: 3 };
    }

    if (body.hospital) {
      const data = await this.authorityRepository.find({
        where: whereClause,
        loadEagerRelations: false,
        relations: {
          hospitals: true,
        },
      });

      return { data, length: 2 };
    }

    if (body.authority) {
      const data = await this.authorityRepository.find({
        where: whereClause,
        loadEagerRelations: false,
      });

      return { data, length: 1 };
    }
  }

  private whereClause(body: ExportDataDto) {
    const { authority, department, departmentUnit, hospital } = body;

    let whereClause = {};

    if (authority !== 'all') {
      whereClause = { id: In([...authority]) };
    }

    if (hospital && hospital !== 'all') {
      whereClause = {
        hospitals: { id: In([...hospital]) },
      };
    }

    if (department && department !== 'all') {
      whereClause = {
        hospitals: {
          departments: { id: In([...department]) },
        },
      };
    }

    if (departmentUnit && departmentUnit !== 'all') {
      whereClause = {
        hospitals: {
          departments: {
            departmentUnits: { id: In([...departmentUnit]) },
          },
        },
      };
    }

    return whereClause;
  }

  private async convertToExcel({ data, length }) {
    const wb = new excel4node.Workbook({
      defaultFont: {
        size: 12,
        name: 'Calibri',
      },
    });

    const ws = wb.addWorksheet('Sheet 1', {
      margins: {
        left: 1.5,
        right: 1.5,
      },
      sheetFormat: {
        baseColWidth: 15,
        defaultColWidth: 25,
      },
    });

    const titleHeaderStyle = wb.createStyle({
      font: {
        color: '#FF8888',
        size: 17,
        bold: true,
      },
      alignment: {
        horizontal: 'center',
      },
    });

    const rowHeaderStyle = wb.createStyle({
      font: {
        color: '#444444',
        size: 15,
        bold: true,
      },
      alignment: {
        horizontal: 'center',
      },
    });

    const mergedCellStyle = wb.createStyle({
      font: {
        color: '#444444',
        size: 13,
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
      },
    });

    /* data to be stored:
      Authority Name
      Authority Initials
      Hospital Name
      Department Name
      Department Unit Name
     */

    const authorityInitialsCol = 1;
    const authorityNameCol = 2;
    const hospitalNameCol = 3;
    const departmentNameCol = 4;
    const departmentUnitNameCol = 5;

    ws.cell(1, authorityInitialsCol, 3, departmentUnitNameCol, true)
      .string(`\r Data Exported\r`)
      .style(titleHeaderStyle);

    const headerObjKey = {
      1: 'Authority Initials',
      2: 'Authority Name',
      3: 'Hospital Name',
      4: 'Department Name',
      5: 'Department Unit Name',
    };

    let rowIndex = 4;
    for (let i = 1; i <= length + 1; i++) {
      ws.cell(rowIndex, i).string(headerObjKey[i]).style(rowHeaderStyle);
    }

    rowIndex += 1;

    let authorityRow = rowIndex;
    // iterating over all the authorities from search query
    for (let i = 0; i < data?.length; i++) {
      const { initials, name, hospitals } = data[i];

      let hospitalRow = authorityRow;
      if (hospitals?.length) {
        // iterating over all the hospitals of an authority
        for (let j = 0; j < hospitals.length; j++) {
          let departmentRow = hospitalRow;

          const { name, departments } = hospitals[j];
          if (departments?.length) {
            // iterating over all the departments of a hospital
            for (let k = 0; k < departments.length; k++) {
              let departmentUnitRow = departmentRow;

              const { name, departmentUnits } = departments[k];
              if (departmentUnits?.length) {
                // iterating over all the department units of a hospital department
                for (let m = 0; m < departmentUnits.length; m++) {
                  const { name } = departmentUnits[m];
                  // populating the department unit name column
                  ws.cell(departmentUnitRow, departmentUnitNameCol).string(
                    name ?? '-',
                  );
                  departmentUnitRow++;
                }
              } else {
                departmentUnitRow++;
              }

              // populating the department name column
              ws.cell(
                departmentRow,
                departmentNameCol,
                departmentUnitRow - 1,
                departmentNameCol,
                true,
              )
                .string(name ?? '-')
                .style(mergedCellStyle);

              departmentRow = departmentUnitRow;
            }
          } else {
            departmentRow += 1;
          }

          // populating the hospital name column
          ws.cell(
            hospitalRow,
            hospitalNameCol,
            departmentRow - 1,
            hospitalNameCol,
            true,
          )
            .string(name ?? '-')
            .style(mergedCellStyle);

          hospitalRow = departmentRow;
        }
      } else {
        hospitalRow += 1;
      }

      // populating the authority initials and authority name column
      ws.cell(
        authorityRow,
        authorityInitialsCol,
        hospitalRow - 1,
        authorityInitialsCol,
      )
        .string(initials ?? '-')
        .style(mergedCellStyle);

      ws.cell(authorityRow, authorityNameCol, hospitalRow - 1, authorityNameCol)
        .string(name ?? '-')
        .style(mergedCellStyle);

      authorityRow = hospitalRow;
    }

    wb.write('Export.xlsx');
  }
}
