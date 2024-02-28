export enum Role {
  User = 'user',
  Admin = 'admin',
  Customer = 'customer',
  Clinic = 'clinic',
  Doctor = 'doctor',
  Staff = 'staff',
}

export type IRole =
  | 'user'
  | 'admin'
  | 'customer'
  | 'clinic'
  | 'doctor'
  | 'staff';
