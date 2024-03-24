import { registerEnumType } from '@nestjs/graphql';
export enum Role {
  Admin = 'admin',
  Customer = 'customer',
  Facility = 'facility',
  Doctor = 'doctor',
  Staff = 'staff',
}

registerEnumType(Role, { name: 'Role' });
