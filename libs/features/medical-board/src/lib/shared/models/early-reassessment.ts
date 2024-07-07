import { BPMUpdateRequest, BilingualText } from "@gosi-ui/core";

export class OhBPMRequest extends BPMUpdateRequest {
    closingStatus?: BilingualText = undefined;
    selectedInspection?: BilingualText;
    reasonForRejection?: string;
    inspectionType?: string;
    rejectionIndicator?: boolean;
    foregoExpenses = false;
    visitingDocRequired? : boolean;
  
  }