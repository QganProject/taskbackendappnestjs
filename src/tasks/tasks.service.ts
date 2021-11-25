//These are the functions refered to by the controller

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
//import { v4 as uuid } from 'uuid'; // Removed for postgres Storage
// import { CreateTaskDto } from './dto/create-task-dto'; // Removed For postgres Storage
// import { GetTasksFilterDto } from './dto/get-tasks-filter-dto'; // Removed For Postgres Storage

// We are now using typeORM its kind of like mongoose which makes it easier to interact with databases
//Line 17 inject taskRepository so that it can be used in all methods
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}
  //No repository Method
  // private tasks: Task[] = []; //best practice to declare as private to prevent errors
  //: Task[] is the type identifier which is from task.model.ts
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  async getTaskById(id: string, user: User): Promise<Task> {
    // const found = await this.tasksRepository.findOne(id);
    // retrieves only the task if it was created by the user who is trying to find it
    const found = await this.tasksRepository.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }
  //No repository Method
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with ${id} Not Found`);
  //   }
  //   return found;
  // }
  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }
  //No repositories Method
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }
  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not Found"`);
    }
  }
  //No Repository Method
  // deleteTaskById(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }
  //No repository Method
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  async updateTask(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
  //No Repository Method
  // updateTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
