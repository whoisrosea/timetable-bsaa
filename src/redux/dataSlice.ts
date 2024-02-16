import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICard, IPodgroup, ITeacher } from "../types/types";

interface dataState {
  cards: ICard[];
  teachers: ITeacher[];
}
const initialState: dataState = {
  cards: [],
  teachers: [],
};

interface AddPodgroupPayload {
  uniqueId: string;
  podgroup: IPodgroup;
}

interface updateTeacherPayload {
  uniqueId: string;
  podgroupIndex: number;
  type: string;
  teacherId: string;
}
interface setOneTeacherPayload {
  podgroup: number;
  uniqueId: string;
  teacherId: string;
}
interface podgroupNumberUpdatePayload {
  value: number;
  podgroup: number;
  uniqueId: string;
}
interface updateAdditionalInfoPayload {
  uniqueId: string;
  value: string;
}
export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addAllCards: (state, action: PayloadAction<ICard[]>) => {
      state.cards = action.payload;
    },
    addAllTeachers: (state, action: PayloadAction<ITeacher[]>) => {
      state.teachers = action.payload;
    },
    addPodgroup: (state, action: PayloadAction<AddPodgroupPayload>) => {
      const { uniqueId, podgroup } = action.payload;
      const cardIndex = state.cards.findIndex(
        (card) => card.uniqueId === uniqueId
      );

      if (cardIndex !== -1) {
        const newPodgroup = {
          ...podgroup,
          lectureTeacher: podgroup.lectureTeacher || "",
          laboratoryTeacher: podgroup.laboratoryTeacher || "",
          practiceTeacher: podgroup.practiceTeacher || "",
          seminarTeacher: podgroup.seminarTeacher || "",
          examTeacher: podgroup.examTeacher || "",
          offsetTeacher: podgroup.offsetTeacher || "",
        };

        state.cards[cardIndex].podgroups.push(newPodgroup);
        state.cards[cardIndex].countPodgroups =
          state.cards[cardIndex].podgroups.length.toString();

        state.cards[cardIndex].podgroups[0].countStudents = Math.round(
          Number(state.cards[cardIndex].podgroups[0].countStudents) / 2
        ).toString();
        state.cards[cardIndex].podgroups[1].countStudents = (
          Number(state.cards[cardIndex].studentsNumber) -
          Number(state.cards[cardIndex].podgroups[0].countStudents)
        ).toString();
      }
    },

    deletePodgroup: (state, action: PayloadAction<string>) => {
      const cardIndex = state.cards.findIndex(
        (card) => card.uniqueId === action.payload
      );
      if (cardIndex !== -1) {
        state.cards[cardIndex].podgroups[0].countStudents =
          state.cards[cardIndex].studentsNumber;
        state.cards[cardIndex].podgroups.splice(1);
        state.cards[cardIndex].countPodgroups = "1";
      }
    },
    setOneTeacher: (state, action: PayloadAction<setOneTeacherPayload>) => {
      const cardIndex = state.cards.findIndex(
        (card) => card.uniqueId === action.payload.uniqueId
      );

      if (cardIndex !== -1) {
        const teacherId = action.payload.teacherId;
        const group = action.payload.podgroup;
        state.cards[cardIndex].podgroups[group].examTeacher = teacherId;
        state.cards[cardIndex].podgroups[group].laboratoryTeacher = teacherId;
        state.cards[cardIndex].podgroups[group].lectureTeacher = teacherId;
        state.cards[cardIndex].podgroups[group].offsetTeacher = teacherId;
        state.cards[cardIndex].podgroups[group].practiceTeacher = teacherId;
        state.cards[cardIndex].podgroups[group].seminarTeacher = teacherId;
      }
    },

    updateTeacher: (state, action: PayloadAction<updateTeacherPayload>) => {
      const { uniqueId, podgroupIndex, type, teacherId } = action.payload;
      const card = state.cards.find((card) => card.uniqueId === uniqueId);
      if (card) {
        const podgroup = card.podgroups[podgroupIndex];
        if (podgroup) {
          switch (type) {
            case "lecture":
              podgroup.lectureTeacher = teacherId;
              break;
            case "laboratory":
              podgroup.laboratoryTeacher = teacherId;
              break;
            case "practice":
              podgroup.practiceTeacher = teacherId;
              break;
            case "seminar":
              podgroup.seminarTeacher = teacherId;
              break;
            case "exam":
              podgroup.examTeacher = teacherId;
              break;
            case "offset":
              podgroup.offsetTeacher = teacherId;
              break;
            default:
              console.warn(`Unknown type: ${type}`);
          }
        }
      }
    },
    podgroupNumberUpdate: (
      state,
      action: PayloadAction<podgroupNumberUpdatePayload>
    ) => {
      const { uniqueId, podgroup, value } = action.payload;

      const cardIndex = state.cards.findIndex(
        (card) => card.uniqueId === uniqueId
      );
      if (cardIndex !== -1) {
        const card = state.cards[cardIndex];
        const currentPodgroupStudents = Number(
          card.podgroups[podgroup].countStudents
        );
        const totalStudents = Number(card.studentsNumber);

        const newTotalStudents =
          totalStudents - currentPodgroupStudents + value;

        card.podgroups[podgroup].countStudents = value.toString();

        card.studentsNumber = newTotalStudents.toString();
      }
    },
    updateAdditionalInfo: (
      state,
      action: PayloadAction<updateAdditionalInfoPayload>
    ) => {
      const cardIndex = state.cards.findIndex(
        (card) => card.uniqueId === action.payload.uniqueId
      );
      if (cardIndex !== -1) {
        state.cards[cardIndex].additionalInfo = action.payload.value;
      }
    },
  },
});

export const {
  addPodgroup,
  addAllCards,
  addAllTeachers,
  deletePodgroup,
  updateTeacher,
  setOneTeacher,
  podgroupNumberUpdate,
  updateAdditionalInfo,
} = dataSlice.actions;

export default dataSlice;
