import React, { useEffect } from "react";

import "./App.css";
import { fetchedData } from "./data";
import Card from "./components/Card";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { addAllCards, addAllTeachers } from "./redux/dataSlice";
import { Button } from "antd";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(addAllCards(fetchedData.data));
    dispatch(addAllTeachers(fetchedData.teachers));
  }, [dispatch]);

  const cards = useAppSelector((state) => state.data.cards);
  const teachers = useAppSelector((state) => state.data.teachers);
  return (
    <div className="App">
      {cards.map((card) => (
        <Card key={card.uniqueId} teachers={teachers} card={card}></Card>
      ))}
      <Button
        onClick={() => {
          console.log(cards);
        }}
      >
        Сохранить
      </Button>
    </div>
  );
}

export default App;
