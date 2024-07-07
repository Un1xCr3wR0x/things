import { GosiCalendar } from '@gosi-ui/core';
import { RescheduleSessionList, UnAvailableMemberListResponse } from '.';

export class RescheduleSessionRequest {
  sessionDate: GosiCalendar = new GosiCalendar();
  startTime: string;
  endTime: string;
  addedListOfMembers: RescheduleSessionList[] = [];
  unAvailableListOfMembers: UnAvailableMemberListResponse[] = [];
}
