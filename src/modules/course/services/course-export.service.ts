import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as excel4node from 'excel4node';
import { Response } from 'express';

import { CourseEntity } from 'entities/index.entity';
import { ExportCourseDataDto } from 'course/dto';
import { addDays, format } from 'date-fns';

@Injectable()
export class CourseExportService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  public async exportCourseData(data: ExportCourseDataDto, response: Response) {
    try {
      const { course: courseId } = data;

      const courseData = await this.courseRepository.findOne({
        where: { id: courseId },
        loadEagerRelations: false,
        relations: [
          'department',
          'trainingSite',
          'trainingSite.timeslots',
          'trainingSite.timeslots.placements',
          'trainingSite.timeslots.placements.student',
          'trainingSite.departmentUnit',
          'trainingSite.departmentUnit.department',
          'trainingSite.departmentUnit.department.hospital',
          'blocks',
          'blocks.blockTrainingSites',
          'blocks.blockTrainingSites.blockTimeslots',
          'blocks.blockTrainingSites.blockTimeslots.placements',
          'blocks.blockTrainingSites.blockTimeslots.placements.student',
          'blocks.blockTrainingSites.departmentUnit',
          'blocks.blockTrainingSites.departmentUnit.department',
          'blocks.blockTrainingSites.departmentUnit.department.hospital',
        ],
      });

      const { blocks } = courseData;

      if (blocks.length === 0) {
        this.createExcelSheetWithoutBlocks(courseData, response);
      }

      if (blocks.length !== 0) {
        this.createExcelSheetWithBlocks(courseData, response);
      }

      return { message: 'Excel exported successfully' };
    } catch (error) {
      console.error('error here', error);
    }
  }

  private createExcelSheetWithoutBlocks(courseData, response) {
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
    ws.cell(rowIndex, departmentCol).string('Department').style(rowHeaderStyle);
    ws.cell(rowIndex, departmentUnitCol).string('Unit').style(rowHeaderStyle);
    ws.cell(rowIndex, dayCol).string('Day').style(rowHeaderStyle);
    ws.cell(rowIndex, timeslotCol).string('Time slot').style(rowHeaderStyle);
    ws.cell(rowIndex, studentIdCol).string('Student ID').style(rowHeaderStyle);
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

                ws.cell(studentRow, studentIdCol).string(
                  studentId.trim().towLo() ?? '-',
                );
                ws.cell(studentRow, studentNameCol).string(name ?? '-');
                ws.cell(studentRow, studentEmailCol).string(
                  email.trim().toLowerCase() ?? '-',
                );

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
  }

  private createExcelSheetWithBlocks(courseData, response) {
    const { department, blocks } = courseData;

    const blockCol = 1;
    const blockTimingCol = 2;
    const hospitalCol = 3;
    const departmentCol = 4;
    const departmentUnitCol = 5;
    const dayCol = 6;
    const timeslotCol = 7;
    const studentIdCol = 8;
    const studentNameCol = 9;
    const studentEmailCol = 10;

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

    ws.cell(1, blockCol, 3, studentEmailCol, true)
      .string(
        `\r Course: ${courseData.name} \r \r Department: ${department.name} \r`,
      )
      .style(titleHeaderStyle);

    let rowIndex = 4;
    ws.cell(rowIndex, blockCol).string('Blocks').style(rowHeaderStyle);
    ws.cell(rowIndex, blockTimingCol)
      .string('Block Timing')
      .style(rowHeaderStyle);
    ws.cell(rowIndex, hospitalCol).string('Hospital').style(rowHeaderStyle);
    ws.cell(rowIndex, departmentCol).string('Department').style(rowHeaderStyle);
    ws.cell(rowIndex, departmentUnitCol).string('Unit').style(rowHeaderStyle);
    ws.cell(rowIndex, dayCol).string('Day').style(rowHeaderStyle);
    ws.cell(rowIndex, timeslotCol).string('Time slot').style(rowHeaderStyle);
    ws.cell(rowIndex, studentIdCol).string('Student ID').style(rowHeaderStyle);
    ws.cell(rowIndex, studentNameCol)
      .string('Student Name')
      .style(rowHeaderStyle);
    ws.cell(rowIndex, studentEmailCol)
      .string('Student Email')
      .style(rowHeaderStyle);

    rowIndex += 1;

    let blockRow = rowIndex;
    if (blocks.length) {
      blocks
        .sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1))
        .forEach((block, index) => {
          let siteRow = blockRow;
          const { blockTrainingSites } = block;

          if (blockTrainingSites.length) {
            blockTrainingSites.forEach((blockTrainingSite) => {
              const { departmentUnit, blockTimeslots } = blockTrainingSite;
              const { department } = departmentUnit;
              const { hospital } = department;

              let slotRow = siteRow;

              if (blockTimeslots.length) {
                blockTimeslots.forEach((slot) => {
                  const { day, startTime, endTime, placements } = slot;

                  let studentRow = slotRow;

                  if (placements.length) {
                    placements.forEach((p) => {
                      const {
                        student: { studentId, name, email },
                      } = p;

                      ws.cell(studentRow, studentIdCol).string(
                        studentId ?? '-',
                      );
                      ws.cell(studentRow, studentNameCol).string(name ?? '-');
                      ws.cell(studentRow, studentEmailCol).string(
                        email?.trim().toLowerCase() ?? '-',
                      );

                      studentRow += 1;
                    });
                  } else {
                    studentRow += 1;
                  }

                  const updatedDay = day.join(', ');

                  ws.cell(slotRow, dayCol, studentRow - 1, dayCol, true)
                    .string(updatedDay ?? '-')
                    .style(mergedCellStyle);
                  ws.cell(
                    slotRow,
                    timeslotCol,
                    studentRow - 1,
                    timeslotCol,
                    true,
                  )
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

          ws.cell(blockRow, blockCol, siteRow - 1, blockCol, true)
            .string(block?.name ?? '-')
            .style(mergedCellStyle);

          const blockStartTime = block?.startsFrom;
          const blockEndTime = block?.endsAt;

          const updatedBlockStartTime = format(
            index === 0
              ? blockStartTime
              : addDays(blockStartTime, index * block.duration),
            'yyyy-MM-dd',
          );

          const updatedBlockEndTime = format(
            index === blocks.length - 1
              ? blockEndTime
              : addDays(updatedBlockStartTime, block.duration - 1),
            'yyyy-MM-dd',
          );

          ws.cell(blockRow, blockTimingCol, siteRow - 1, blockTimingCol, true)
            .string(`${updatedBlockStartTime} till ${updatedBlockEndTime}`)
            .style(mergedCellStyle);

          blockRow = siteRow;
        });
    } else {
      blockRow += 1;
    }

    wb.write('Excel.xlsx', response);
  }
}
