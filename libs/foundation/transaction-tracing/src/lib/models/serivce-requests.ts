import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';
import { GosiCalendar } from '@gosi-ui/core/lib/models/gosi-calendar';

export class ServiceRequestDetails {
  complaintDetails: string = null;
  id: number = null;
  complaintTitle: BilingualText = new BilingualText();
  description: BilingualText = new BilingualText();
  contributorId: number = null;
  establishmentId: number = null;
  creationTimestamp: GosiCalendar = new GosiCalendar();
  lastModifiedTimestamp: GosiCalendar = new GosiCalendar();
  status: BilingualText = new BilingualText();
  icon: string = null;
  showBox: boolean;
}
