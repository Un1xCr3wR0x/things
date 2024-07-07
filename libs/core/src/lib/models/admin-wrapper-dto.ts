import { Person } from './person';
import { Lov } from './lov';
//Use to bind the response of admin wrapper
//Any change in this dto should be also in admin-wrapper and the corresponding binding to be done in all services.
export class AdminWrapperDto {
  admins: Array<AdminDto> = [];
  adminFilterResponseDto: AdminFilterResponse;
}
export class AdminDto extends Person {
  roles: Array<number>;
}
export class AdminFilterResponse {
  nationalitiesPresent: Array<Lov> = [];
  roles: number[];
}
