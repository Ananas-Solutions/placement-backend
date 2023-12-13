import { Injectable } from '@nestjs/common';
import * as excel4node from 'excel4node';
import { Response } from 'express';

import { ExportCourseDataDto } from 'course/dto';
import { CoursesRepositoryService } from 'repository/services';

@Injectable()
export class CourseExportService {
  constructor(private readonly courseRepository: CoursesRepositoryService) {}

  public async exportCourseData(data: ExportCourseDataDto, response: Response) {
    try {
      const { course: courseId } = data;

      const courseData = await this.courseRepository.findOne(
        {
          id: courseId,
        },
        {
          department: true,
          trainingSite: {
            timeslots: { placements: { student: true } },
            departmentUnit: { department: { hospital: true } },
          },
        },
      );

      const { department, trainingSite } = courseData;

      const hospitalCol = 1;
      const departmentCol = 2;
      const departmentUnitCol = 3;
      const dayCol = 4;
      const timeslotCol = 5;
      const studentIdCol = 6;
      const studentNameCol = 7;
      const studentEmailCol = 8;

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

      ws.cell(1, hospitalCol, 3, studentEmailCol, true)
        .string(
          `\r Course: ${courseData.name} \r \r Department: ${department.name} \r`,
        )
        .style(titleHeaderStyle);

      let rowIndex = 4;
      ws.cell(rowIndex, hospitalCol).string('Hospital').style(rowHeaderStyle);
      ws.cell(rowIndex, departmentCol)
        .string('Department')
        .style(rowHeaderStyle);
      ws.cell(rowIndex, departmentUnitCol).string('Unit').style(rowHeaderStyle);
      ws.cell(rowIndex, dayCol).string('Day').style(rowHeaderStyle);
      ws.cell(rowIndex, timeslotCol).string('Time slot').style(rowHeaderStyle);
      ws.cell(rowIndex, studentIdCol)
        .string('Student ID')
        .style(rowHeaderStyle);
      ws.cell(rowIndex, studentNameCol)
        .string('Student Name')
        .style(rowHeaderStyle);
      ws.cell(rowIndex, studentEmailCol)
        .string('Student Email')
        .style(rowHeaderStyle);

      rowIndex += 1;

      let siteRow = rowIndex;
      if (trainingSite.length) {
        trainingSite.forEach((site) => {
          const { departmentUnit, timeslots } = site;
          const { department } = departmentUnit;
          const { hospital } = department;

          let slotRow = siteRow;

          if (timeslots.length) {
            timeslots.forEach((slot) => {
              const { day, startTime, endTime, placements } = slot;

              let studentRow = slotRow;

              if (placements.length) {
                placements.forEach((p) => {
                  const {
                    student: { studentId, name, email },
                  } = p;

                  ws.cell(studentRow, studentIdCol).string(studentId ?? '-');
                  ws.cell(studentRow, studentNameCol).string(name ?? '-');
                  ws.cell(studentRow, studentEmailCol).string(email ?? '-');

                  studentRow += 1;
                });
              } else {
                studentRow += 1;
              }

              const updatedDay = day.join(', ');

              ws.cell(slotRow, dayCol, studentRow - 1, dayCol, true)
                .string(updatedDay ?? '-')
                .style(mergedCellStyle);
              ws.cell(slotRow, timeslotCol, studentRow - 1, timeslotCol, true)
                .string(`${startTime}-${endTime}` ?? '-')
                .style(mergedCellStyle);

              slotRow = studentRow;
            });
          } else {
            slotRow += 1;
          }

          ws.cell(siteRow, hospitalCol, slotRow - 1, hospitalCol, true)
            .string(hospital?.name ?? '-')
            .style(mergedCellStyle);
          ws.cell(siteRow, departmentCol, slotRow - 1, departmentCol, true)
            .string(department?.name ?? '-')
            .style(mergedCellStyle);
          ws.cell(
            siteRow,
            departmentUnitCol,
            slotRow - 1,
            departmentUnitCol,
            true,
          )
            .string(departmentUnit?.name ?? '-')
            .style(mergedCellStyle);

          siteRow = slotRow;
        });
      } else {
        siteRow += 1;
      }

      wb.write('Excel.xlsx', response);

      return { message: 'Excel exported successfully' };
    } catch (error) {
      console.error('error here', error);
    }
  }
}
