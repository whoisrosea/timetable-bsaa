import React, { useEffect } from "react";
import "./App.css";
import Card from "./components/Card";
import { useAppDispatch, useAppSelector } from "./redux/store";
import {  fetchCards, updateData } from "./redux/dataSlice";
import { Button } from "antd";

function App() {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.data);
  useEffect(() => {
    if (data.cards.length === 0) {
      dispatch(fetchCards());
    }
  }, [data.cards.length, dispatch]);
  const cards = useAppSelector((state) => state.data.cards);
  
  return (
    data.status ==="loading" ? (<div>"loading..."</div>) : data.error ? (<div>{data.error}</div>) : (
    <div className="App">
      <div className="AppCards">
        {cards?.map((card) => (
          <Card key={card.uniqueId} teachers={data.teachers} card={card}></Card>
        ))}
      </div>
      <Button
        className="AppButton"
        onClick={() => {
          dispatch(updateData(data))
          
        }}
      >
        Сохранить
      </Button>
    </div>)
    
  );
}

export default App;
