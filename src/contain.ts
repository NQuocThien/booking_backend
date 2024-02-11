import { registerEnumType } from '@nestjs/graphql';

export enum EAcademicTitle { // học hàm
  Professor = 'GS',
  AssociateProfesso = 'PGS',
}

export enum EDegree {
  Doctorate = 'TS',
  MasterDoctor = 'ThS',
  Doctor = 'BS',
  DoctorS1 = 'BS CKI',
  DoctorS2 = 'BS CKII',
}
export enum EGender {
  Male = 'Nam',
  Female = 'Nữ',
}

export enum EStatusService {
  Open = 'Open',
  Close = 'Close',
}
