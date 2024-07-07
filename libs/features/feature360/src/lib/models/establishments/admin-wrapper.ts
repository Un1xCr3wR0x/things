import { AdminFilterResponse } from '../establishments/admin-filter-response';
import { Admin } from '../establishments/admin';

export class AdminWrapper {
  admins: Array<Admin> = [];
  adminFilterResponseDto?: AdminFilterResponse;
}
