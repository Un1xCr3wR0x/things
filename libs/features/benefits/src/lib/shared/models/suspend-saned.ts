import { BilingualText, GosiCalendar } from '@gosi-ui/core';

export interface SuspendSanedRequest {
  sin?: number;
  benefitRequestId?: number;
  referenceNo?: number;
  suspendDate?: string;
  reasonCode?: BilingualText;
  notes?: string;
  comments?: string;
}

export interface SuspendSanedResponse {
  referenceNo?: number;
  message?: BilingualText;
}

export interface SuspendSanedDetails {
  suspendDate: GosiCalendar;
  reason: BilingualText;
  notes: string;
}
