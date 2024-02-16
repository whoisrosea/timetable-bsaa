export interface ITeacher {
  id: string;
  name: string;
}

export interface IPodgroup {
  countStudents: string;
  laboratoryTeacher: string;
  lectureTeacher: string;
  practiceTeacher: string;
  seminarTeacher: string;
  examTeacher: string;
  offsetTeacher: string;
  [key: string]: string;
}

export interface ICard {
  subjectName: string;
  course: string;
  semestr: string;
  studentsNumber: string;
  groupName: string;
  lecturesHours: string;
  laboratoryHours: string;
  practicHours: string;
  seminarHours: string;
  exam: boolean;
  offset: boolean;
  additionalInfo: string;
  countPodgroups: string;
  uniqueId: string;
  podgroups: IPodgroup[];
  
}

