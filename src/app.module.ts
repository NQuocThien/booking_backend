import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    
    MongooseModule.forRoot(
      'mongodb+srv://nqthienwebdev:mongoDB@cluster0.y9garcd.mongodb.net/db_dev'
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src.shema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
  }),
  UsersModule,
  AuthModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
