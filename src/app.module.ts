import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UploaderModule } from './modules/uploader/uploader.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SettingModule } from './modules/setting/setting.module';
import { GeneralInforModule } from './modules/general-infor/general-infor.module';

dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src.shema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../files'),
    }),
    UsersModule,
    AuthModule,
    UploaderModule,
    ProfileModule,
    SettingModule,
    GeneralInforModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
  ]
})
export class AppModule { }
