import { Task } from 'src/tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //Throws error if its duplicate
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;

  // This Field specifies the field that was created or is owned by this user
  //One user for many tasks makes it into a relation
  //type defines it as Task the _ removes unused error
  // second param is how to access it
  //eager means that wheneevr this type is fetched if it is set to true then also retrieves the other data
  // which in this case is tasks
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
