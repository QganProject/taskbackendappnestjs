//// This is the model for the Task Entity kind of like the mongoose model

//Removed since we have all our models in the database
// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
// }

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
