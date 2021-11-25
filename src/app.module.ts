import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';
import { configValidationSchema } from './config.schema';

// for root app module files use forRoot
// for any sub module use forFeature
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
      // Create the variable first
      //in package .json add cross-env STAGE=dev before the commands
      // then env variable that defines what stage you are in development
      //so that the file knows what settings to deploy and what not to include
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      // use orm to initialize asynchrnously or laod the values in
      imports: [ConfigModule],
      inject: [ConfigService],
      // This function can perform anything either retrieve from database its your call
      // You can do dependency injection

      useFactory: async (configService: ConfigService) => {
        // you can return or just wrap it in ()
        const isProduction = configService.get('STAGE') === 'prod';
        return {
          ssl: isProduction,
          extra: {
            ssl: isProduction ? { rejectUnauthorized: false } : null,
          },
          type: 'postgres',
          autoLoadEntities: true, // loads the whole table or all entities automatically
          synchronize: true, // Synchronizes with db
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   // host: 'localhost',
    //   // port: 5432,
    //   // username: 'postgres',  // Inside env dev file
    //   // password: 'postgres',  // synchronous method
    //   // database: 'task-management',
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    AuthModule,
  ],
})
export class AppModule {}
