import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { Logger } from '@nestjs/common';

@EntityRepository(Task)
// Single function built in repository that build function
//eliminates the need for a specific function in service
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true }); // timestamp enabled
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', //  wrap in parenthesis to treat it as one condition
        { search: `%${search}%` },
      );
      // Search query `%${search}%` the"%" means that it will match all the letters of the search value
      // Case sensitive make sure no space in bet :search or :status in queries
      // LOWER sets the query and value to lowercase
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}" 
      Filters ${JSON.stringify(filterDto)}`,
        error.stack, // prints the error and where it is
      );
    }
  }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    //Create the object to be saved with info that were received
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user, // Define user who owns the task added in the user entity file
    });
    await this.save(task);
    return task;
  }
}
