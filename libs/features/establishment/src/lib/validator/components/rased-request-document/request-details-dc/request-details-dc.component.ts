/**
 * ~ Copyright GOSI. All Rights Reserved.
  ~  This software is the proprietary information of GOSI.
  ~  Use is subject to license terms.
 */

import { Component, Input, OnInit } from '@angular/core';
import {
  Establishment,
  InspectionDetails,
  RequiredUploadDocumentsResponse
} from '@gosi-ui/features/establishment/lib/shared';

@Component({
  selector: 'est-request-details-dc',
  templateUrl: './request-details-dc.component.html',
  styleUrls: ['./request-details-dc.component.scss']
})
export class RequestDetailsDcComponent implements OnInit {
  @Input() uploadDocumentsDetails: RequiredUploadDocumentsResponse;
  @Input() inspectionDetails: InspectionDetails;
  @Input() establishment: Establishment;

  constructor() {}

  ngOnInit(): void {}
}
