import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICard, IPodgroup, ITeacher } from "../types/types";
import axios from "axios";

//TODO: fix types naming
interface DataState {
  cards: ICard[];
  teachers: ITeacher[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DataState = {
  cards: [],
  teachers: [],
  status: "idle",
  error: null,
};

interface AddPodgroupPayload {
  uniqueId: string;
  podgroup: IPodgroup;
}

interface UpdateTeacherPayload {
  uniqueId: string;
  podgroupIndex: number;
  type: string;
  teacherId: string;
}
interface SetOneTeacherPayload {
  podgroup: number;
  uniqueId: string;
  teacherId: string;
}
interface PodgroupNumberUpdatePayload {
  value: number;
  podgroup: number;
  uniqueId: string;
}
interface UpdateAdditionalInfoPayload {
  uniqueId: string;
  value: string;
}

export const fetchCards = createAsyncThunk("card/fetch", async (_) => {
  const response = await fetch("https://bgaa.by/test");
  const data = response.json();
  return data;
});

export const updateData = createAsyncThunk(
  "data/update",
  async (updateData: DataState, thunkAPI) => {
    try {
      const data = await axios.post(
        "https://bgaa.by/test_result", // выдает 404 ошибку при обращении к данному url
        JSON.stringify(updateData)
      );
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
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
          +state.cards[cardIndex].podgroups[0].countStudents / 2
        ).toString();
        state.cards[cardIndex].podgroups[1].countStudents = (
          +state.cards[cardIndex].studentsNumber -
          +state.cards[cardIndex].podgroups[0].countStudents
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
    setOneTeacher: (state, action: PayloadAction<SetOneTeacherPayload>) => {
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

    updateTeacher: (state, action: PayloadAction<UpdateTeacherPayload>) => {
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
      action: PayloadAction<PodgroupNumberUpdatePayload>
    ) => {
      const { uniqueId, podgroup, value } = action.payload;

      const cardIndex = state.cards.findIndex(
        (card) => card.uniqueId === uniqueId
      );
      if (cardIndex !== -1) {
        const card = state.cards[cardIndex];
        const currentPodgroupStudents = +card.podgroups[podgroup].countStudents;
        const totalStudents = +card.studentsNumber;

        const newTotalStudents =
          totalStudents - currentPodgroupStudents + value;

        card.podgroups[podgroup].countStudents = value.toString();

        card.studentsNumber = newTotalStudents.toString();
      }
    },
    updateAdditionalInfo: (
      state,
      action: PayloadAction<UpdateAdditionalInfoPayload>
    ) => {
      const cardIndex = state.cards.findIndex(
        (card) => card.uniqueId === action.payload.uniqueId
      );
      if (cardIndex !== -1) {
        state.cards[cardIndex].additionalInfo = action.payload.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCards.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchCards.fulfilled,
        (
          state,
          action: PayloadAction<{ data: ICard[]; teachers: ITeacher[] }>
        ) => {
          state.status = "succeeded";
          state.cards = action.payload.data;
          state.teachers = action.payload.teachers;
        }
      )
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Something went wrong";
      });
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
