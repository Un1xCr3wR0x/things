/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class ItTicketResponse {
  incidentNumber: string = undefined;
  fromJsonToObject(json) {
    this.incidentNumber = json.incidentNumber;
    return this;
  }
}
