
import { BilingualText } from '@gosi-ui/core/lib/models/bilingual-text';
import { GosiCalendar } from '@gosi-ui/core/lib/models/gosi-calendar';

export class NotesTimelineResponse {

    priority: BilingualText;
    employeeName: string;
    creationDate: GosiCalendar;
    note: string;
}

