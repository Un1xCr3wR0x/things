import { SessionLimitRequest } from './session-limit-request';
import { SessionFilterRequest } from './session-filter-request';
import { AddMemberFilterRequest } from './add-member-filter-request';

export class SessionRequest {
  searchKey: string = undefined;
  doctorType: number = undefined;
  limit: SessionLimitRequest = new SessionLimitRequest();
  filter: SessionFilterRequest = new SessionFilterRequest();
  filterData: AddMemberFilterRequest = new AddMemberFilterRequest();
  startTime?: string = undefined;
  endTime?: string = undefined;
}
