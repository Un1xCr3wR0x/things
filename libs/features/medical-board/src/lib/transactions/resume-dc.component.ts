/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '@gosi-ui/core';
import { MedicalBoardService } from '../shared';

@Component({
  selector: 'mb-resume-dc',
  templateUrl: './resume-dc.component.html',
  styles: []
})
export class ResumeDcComponent implements OnInit {
  transactionId: number;
  transactionRefId: number;
  transaction: Transaction;
  identificationNo: string;
  contractId: string;

  constructor(readonly route: ActivatedRoute, readonly router: Router, 
    readonly mbService: MedicalBoardService) {}

  ngOnInit(): void {
    this.transaction = this.route.snapshot.data.transaction;
    if (this.transaction) {
      this.transactionId = this.transaction.transactionId;
      this.transactionRefId = this.transaction.transactionRefNo;
      this.mbService.medicalProfessionalId = Number(this.transaction?.params?.MBPROFESSIONALID_ID);
      this.mbService.contractId = Number(this.transaction.params?.MBCONTRACT_ID);
      this.mbService.identifier = Number(this.transaction.params?.IDENTIFIER);
      this.mbService.transactionRefNo = Number(this.transaction?.transactionRefNo);
    }
    this.navigate(this.transactionId);
  }
  navigate(transactionId) {
    switch (transactionId) {
      case 101545:
        {
          this.router.navigate(
            [
              `/home/medical-board/add-members/edit`
            ], 
          { replaceUrl: true });
        }
        break;
      case 101580:
        {
          this.router.navigate(
            [
              `/home/medical-board/doctor-profile/${this.mbService.identifier}/modify-contract/${this.mbService.contractId}/edit`
            ],
            { replaceUrl: true }
          );
        }
        break;
      case 101581: {
        this.router.navigate(
          [
            `/home/medical-board/doctor-profile/${this.mbService.identifier}/terminate-contract/${this.mbService.contractId}/edit`
          ],
          { replaceUrl: true }
        );
      }
    }
  }
}
