import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { UploaderModule } from './modules/uploader/uploader.module';
// import { ProfileModule } from './modules/profile/profile.module';
import { SettingModule } from './modules/setting/setting.module';
import { GeneralInforModule } from './modules/general-infor/general-infor.module';
import { CustomerModule } from './modules/customer/customer.module';
import { MedicalFacilitiesModule } from './modules/medical-facilities/medical-facilities.module';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { MedicalSpecialtiesModule } from './modules/medical-specialties/medical-specialties.module';
import { DegreeModule } from './modules/degree/degree.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RegisterModule } from './modules/register/register.module';
import { CarePackageModule } from './modules/care-package/care-package.module';
import { TypePackageModule } from './modules/type-package/type-package.module';
import { MedicalStaffModule } from './modules/medical-staff/medical-staff.module';
import { VaccinationModule } from './modules/vaccination/vaccination.module';
import { PackageModule } from './modules/package/package.module';

dotenv.config();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src.shema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '../files'),
    // }), // cấu hình static files
    UsersModule,
    AuthModule,
    UploaderModule,
    // ProfileModule,
    SettingModule,
    GeneralInforModule,
    CustomerModule,
    MedicalFacilitiesModule,
    DoctorsModule,
    MedicalSpecialtiesModule,
    DegreeModule,
    ProfileModule,
    RegisterModule,
    CarePackageModule,
    TypePackageModule,
    MedicalStaffModule,
    VaccinationModule,
    PackageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
