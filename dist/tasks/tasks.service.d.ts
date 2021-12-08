import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
export declare class TasksService {
    private tasksRepository;
    constructor(tasksRepository: TasksRepository);
    getTaskById(id: string, user: User): Promise<Task>;
    getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]>;
    deleteTaskById(id: string, user: User): Promise<void>;
    createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task>;
    updateTask(id: string, status: TaskStatus, user: User): Promise<Task>;
}
