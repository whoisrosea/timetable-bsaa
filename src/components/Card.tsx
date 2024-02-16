import React, { FC } from "react";
import "./styles/styles.scss";
import { BookOutlined } from "@ant-design/icons";
import { ICard, ITeacher } from "../types/types";
import CardShedule from "./CardShedule";

interface CardProps {
  card: ICard;
  teachers: ITeacher[];
}

const Card: FC<CardProps> = ({ card, teachers }) => {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2>
          <BookOutlined style={{ marginRight: "10px" }} />
          {card.subjectName}
        </h2>
      </div>
      <div className="cardInfo">
        <div>
          <p>Группа</p> {card.groupName}
        </div>
        <div>
          <p>Курс</p> {card.course}
        </div>
        <div>
          <p>Количество Курсантов </p>
          {card.studentsNumber}
        </div>
        <div>
          <p>Семестр</p>
          {card.semestr}
        </div>
      </div>
      <CardShedule card={card} teachers={teachers} />
    </div>
  );
};

export default Card;
