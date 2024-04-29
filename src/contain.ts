import { registerEnumType } from '@nestjs/graphql';
export enum EAcademicTitle { // học hàm
  Professor = 'GS',
  AssociateProfesso = 'PGS',
}

export enum EDegree { // bằng cấp
  Doctorate = 'TS BS',
  MasterDoctor = 'ThS BS',
  Doctor = 'BS',
  DoctorS1 = 'BS CKI',
  DoctorS2 = 'BS CKII',
}
export enum EGender {
  Male = 'Nam',
  Female = 'Nữ',
}
export enum EGenderPackage {
  Male = 'Nam',
  Female = 'Nữ',
  Both = 'Nam và nữ',
}
registerEnumType(EGender, {
  name: 'EGender',
});

export enum EStatusService {
  Open = 'Mở',
  Close = 'Đóng',
}

export enum EStateRegister {
  Pending = 'Chưa duyệt',
  Approved = 'Đã duyệt',
  Success = 'Đã khám',
}

export enum ETypeOfService {
  Doctor = 'Khám theo Bác sĩ',
  Specialty = 'Khám theo Chuyên khoa',
  Package = 'Khám theo gói',
  Vaccine = 'Tiêm chủng',
}

export enum ETypeOfNotification {
  Seen = 'Đã xem',
  NotSeen = 'Chưa xem',
}

export enum EDayOfWeed {
  Monday = '2',
  Tuesday = '3',
  Wednesday = '4',
  Thursday = '5',
  Friday = '6',
  Saturday = '7',
  Sunday = 'Chủ nhật',
}

export enum EPermission {
  Magager = 'Quản lý',
  MagagerPending = 'Duyệt khám',
  ManagerSpecialty = 'Quản lý chuyên khoa',
  MagagerPackage = 'Quản lý gói khám',
  MagagerVaccine = 'Quản lý tim chủng',
}

export enum ETypeOfFacility {
  publicHospital = 'Bệnh viện công',
  privateHospital = 'Bệnh viện tư',
  clinic = 'Phòng khám',
  vaccinationCenter = 'Trung tâm tiêm chủng',
}

export enum EnumBlogStatus {
  NotPublic = 'NotPublic',
  Public = 'Public',
  Deleted = 'Deleted',
}

export enum EnumBlogType {
  Medical = 'Medical',
  Health = 'Health',
  Service = 'Service',
}

registerEnumType(EnumBlogType, {
  name: 'EnumBlogType',
});
registerEnumType(EnumBlogStatus, {
  name: 'EnumBlogStatus',
});
registerEnumType(ETypeOfFacility, {
  name: 'ETypeOfFacility',
});
registerEnumType(EPermission, {
  name: 'EPermission',
});
registerEnumType(EDayOfWeed, {
  name: 'EDayOfWeed',
});
registerEnumType(EStatusService, {
  name: 'EStatusService',
});
