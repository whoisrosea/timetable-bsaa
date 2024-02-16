import { Select } from "antd";
import React, { FC } from "react";
import { ITeacher } from "../types/types";

interface TeacherSelectProps {
  teachers: ITeacher[];
  onChange: any;
  disabled: boolean;
  value: string | undefined;
}

const TeacherSelect: FC<TeacherSelectProps> = ({
  teachers,
  onChange,
  disabled,
  value,
}) =>
  disabled ? (
    <Select className="select" disabled defaultValue="Вакансия">
      <Select.Option>Вакансия</Select.Option>
    </Select>
  ) : (
    <Select
      defaultValue="Преподаватель"
      value={value}
      className="select"
      onChange={onChange}
      disabled={disabled}
    >
      {teachers.map((teacher: ITeacher) => (
        <Select.Option key={teacher.id} value={teacher.id}>
          {teacher.name}
        </Select.Option>
      ))}
    </Select>
  );

export default TeacherSelect;
