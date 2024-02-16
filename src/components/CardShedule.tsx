import React, { FC } from "react";
import TeacherSelect from "./TeacherSelect";
import { Input } from "antd";
import { ICard, ITeacher } from "../types/types";
import TextArea from "antd/es/input/TextArea";
import "./styles/styles.scss";
import {
  DeleteOutlined,
  PlusOutlined,
  SelectOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "../redux/store";
import {
  addPodgroup,
  deletePodgroup,
  podgroupNumberUpdate,
  setOneTeacher,
  updateAdditionalInfo,
  updateTeacher,
} from "../redux/dataSlice";

interface CardScheduleProps {
  card: ICard;
  teachers: ITeacher[];
}

const CardSchedule: FC<CardScheduleProps> = ({ card, teachers }) => {
  const dispatch = useAppDispatch();
  const onChangeTeacher = (
    type: string,
    podgroupIndex: number,
    teacherId: string
  ) => {
    dispatch(
      updateTeacher({
        uniqueId: card.uniqueId,
        podgroupIndex, // Индекс подгруппы, если у вас их несколько
        type, // Тип занятия, например 'lecture', 'laboratory', и т.д.
        teacherId, // ID выбранного преподавателя
      })
    );
  };

  const renderScheduleRow = (
    label: string,
    hours: number | string,
    key: string
  ) => {
    return (
      <div className={`cardScheduleRow pod${card.countPodgroups}`} key={key}>
        <div>{label}</div>
        <div>{hours}</div>
        <div className="selectContainer">
          <TeacherSelect
            value={card.podgroups[0][`${key}Teacher`]}
            teachers={teachers}
            onChange={(teacherId: string) => onChangeTeacher(key, 0, teacherId)}
            disabled={Number(hours) > 0 ? false : true}
          />
          {key === "lecture" && (
            <SelectOutlined
              style={{ marginLeft: 10 }}
              onClick={() => {
                dispatch(
                  setOneTeacher({
                    uniqueId: card.uniqueId,
                    teacherId: card.podgroups[0][`${key}Teacher`],
                    podgroup: 0,
                  })
                );
              }}
            />
          )}
        </div>
        {card.countPodgroups === "2" && (
          <div className="selectContainer">
            <TeacherSelect
              value={card.podgroups[1][`${key}Teacher`]}
              teachers={teachers}
              onChange={(teacherId: string) =>
                onChangeTeacher(key, 1, teacherId)
              }
              disabled={Number(hours) > 0 ? false : true}
            />
            {key === "lecture" && (
              <SelectOutlined
                style={{ marginLeft: 10 }}
                onClick={() => {
                  dispatch(
                    setOneTeacher({
                      uniqueId: card.uniqueId,
                      teacherId: card.podgroups[1][`${key}Teacher`],
                      podgroup: 1,
                    })
                  );
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cardSchedule">
      <div className={`cardScheduleRow header pod${card.countPodgroups}`}>
        <div>Занятие</div>
        <div>Часы</div>
        {card.countPodgroups === "1" ? (
          <div>
            Преподаватель
            <PlusOutlined
              style={{ marginLeft: 10 }}
              onClick={() => {
                dispatch(
                  addPodgroup({
                    uniqueId: card.uniqueId,
                    podgroup: card.podgroups[0],
                  })
                );
              }}
            />
          </div>
        ) : (
          <>
            <div>Подгруппа 1</div>
            <div>
              Подгруппа 2{" "}
              <DeleteOutlined
                style={{ marginLeft: 10 }}
                onClick={() => dispatch(deletePodgroup(card.uniqueId))}
              />
            </div>
          </>
        )}
      </div>

      {renderScheduleRow("Лекции", card.lecturesHours, "lecture")}
      {renderScheduleRow(
        "Лабораторные работы",
        card.laboratoryHours,
        "laboratory"
      )}
      {renderScheduleRow("Практические", card.practicHours, "practice")}
      {renderScheduleRow("Семинарские", card.seminarHours, "seminar")}
      {card.countPodgroups === "2" && (
        <div className="cardScheduleRow pod2">
          <div>Количество человек</div>
          <div></div>
          <Input
            type="number"
            value={card.podgroups[0].countStudents}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              const value = Number(e.target.value);
              dispatch(
                podgroupNumberUpdate({
                  value: value,
                  podgroup: 0,
                  uniqueId: card.uniqueId,
                })
              );
            }}
          />
          <Input
            type="number"
            value={card.podgroups[1].countStudents}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => {
              const value = Number(e.target.value);
              dispatch(
                podgroupNumberUpdate({
                  value: value,
                  podgroup: 1,
                  uniqueId: card.uniqueId,
                })
              );
            }}
          />
        </div>
      )}
      {card.offset && renderScheduleRow("Зачет", "", "offset")}
      {card.exam && renderScheduleRow("Экзамен", "", "exam")}

      <div className={`cardScheduleRow note${card.countPodgroups}`}>
        <div>Примечание</div>
        <div></div>
        <div>
          <TextArea
            value={card.additionalInfo}
            onChange={(e) =>
              dispatch(
                updateAdditionalInfo({
                  value: e.target.value,
                  uniqueId: card.uniqueId,
                })
              )
            }
            className="textArea"
          ></TextArea>
        </div>
      </div>
    </div>
  );
};

export default CardSchedule;
