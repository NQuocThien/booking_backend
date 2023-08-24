import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploaderModule } from './modules/uploader/uploader.module';
import { ProfileModule } from './modules/profile/profile.module';
dotenv.config();
@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../files'), 
    // }),
    ConfigModule.forRoot({ isGlobal: true}),
    MongooseModule.forRoot(
      process.env.MONGO_URI
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src.shema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
  }),
  UsersModule,
  AuthModule,
  UploaderModule,
  ProfileModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
