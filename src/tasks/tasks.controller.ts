//This file is where the request enters first

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
// import { Task, TaskStatus } from './task-status.enum'; Updated For POstgres
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Logger } from '@nestjs/common';

@Controller('tasks') //url to define in postman /tasks
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: User, // Gets only the tasks owned or created by the user
  ): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks 
    Filters: ${JSON.stringify(filterDto)}`); // filters are the ones in the url after /tasks
    return this.tasksService.getTasks(filterDto, user);
  }
  // No Data Mapper or repository Method
  //   @Get()
  //   getAllTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
  //     if (Object.keys(filterDto).length) {
  //       return this.tasksService.getTasksWithFilters(filterDto);
  //     } else {
  //       return this.tasksService.getAllTasks();
  //     }
  //   }

  //   //http://localhost:3000/tasks/id
  //   //define unique url to distinguish between get requests
  //   //In this case its /tasks/id youre trying to find

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    //we dont have to declare this method as async since in the service it was already declared as such
    return this.tasksService.getTaskById(id, user);
  }
  //No Data mapper or repository Method
  //   @Get('/:id')
  //   getTaskById(@Param('id') id: string): Task {
  //     return this.tasksService.getTaskById(id);
  //   }
  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    // Uses the created getUser decorator to get the user
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks 
    Filters: ${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto, user);
  }
  //No Data mapper or repository Method
  //   @Post()
  //   createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //     //the line above equates the retrieved body to cretetaskdto object variables title and description
  //     // The : Task is the return value or callback
  //     return this.tasksService.createTask(createTaskDto);
  //   }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.tasksService.deleteTaskById(id, user);
  }
  //No Data mapper or repository Method
  //   @Delete('/:id')
  //   deleteTask(@Param('id') id: string): void {
  //     return this.tasksService.deleteTaskById(id);
  //   }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTask(id, status, user);
  }
  // No Data Mapper or Repository
  //   @Patch('/:id/status')
  //   updateTaskStatus(
  //     @Param('id') id: string,
  //     @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  //   ): Task {
  //     const { status } = updateTaskStatusDto;
  //     return this.tasksService.updateTask(id, status);
  //   }
}
