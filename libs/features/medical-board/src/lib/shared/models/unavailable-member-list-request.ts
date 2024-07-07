import { RescheduleSessionList } from '.';

export class UnAvailableMemberListRequest {
  startDate: string;
  startTime: string;
  endTime: string;
  endDate?: string;
  sessionId?: number;
  mbList?: number[];
}
