import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from '@gosi-ui/core';
import { OhService } from '../shared';

@Component({
  selector: 'oh-resume-dc',
  templateUrl: './resume-dc.component.html'
})
export class ResumeDcComponent implements OnInit {
  transactionId: number;
  socialInsuranceNo: number;
  registrationNo: number;
  businessId: number;
  injuryId: number;
  reimbId: number;
  transactionRefId: number;
  transaction: Transaction;

  constructor(readonly route: ActivatedRoute, readonly router: Router, readonly ohService: OhService) {}

  ngOnInit(): void {
    this.transaction = this.route.snapshot.data.transaction;
    if (this.transaction) {
      this.transactionId = this.transaction.transactionId;
      this.socialInsuranceNo = this.transaction.params.SIN;
      this.registrationNo = this.transaction.params.REGISTRATION_NO;
      this.transactionRefId = this.transaction.transactionRefNo;
      this.businessId = this.transaction.businessId;
      this.injuryId = this.transaction.params.INJURY_ID;
      this.reimbId = this.transaction.params.REIMBURSEMENT_ID;
      this.ohService.setTransactionRefId(this.transactionRefId);
      this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
      this.ohService.setDiseaseId(this.businessId);
      this.ohService.setTransactionStatus(this.transaction.status);
    }
    this.navigate(this.transactionId);
  }

  navigate(transactionId) {     
    switch (transactionId) {
      case 101501:
        {
          this.router.navigate(
            [
              `home/oh/injury/${this.transactionId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/add`
            ],
            { replaceUrl: true }
          );
        }
        break;
      case 101527:
        {
          this.router.navigate(
            [
              `home/oh/complication/edit/${this.transactionId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/${this.injuryId}`
            ],
            { replaceUrl: true }
          );
        }
        break;
      case 101573:
        {
          this.router.navigate(
            [
              `home/oh/injury/${this.transactionId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/reopen`
            ],
            { replaceUrl: true }
          );
        }
        break;
      case 101574:
        {
          this.router.navigate([
            `home/oh/complication/${this.transactionId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/${this.injuryId}/re-open`
          ]);
        }
        break;
      case 101571:
        {
          this.router.navigate([
            `home/oh/injury/${this.transactionId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/modify`
          ]);
        }
        break;
      case 300397:
      {
        this.router.navigate([
          `home/oh/group-injury/${this.transactionId}/${this.registrationNo}/${this.businessId}/modify`
        ]);
      }
      break;
      case 101572:
        {
          this.router.navigate([
            `home/oh/complication/${this.transactionId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/${this.injuryId}/modify`
          ]);
        }
        break;
      case 101530:
        if (this.injuryId) {
          {
            this.router.navigate([
              `home/oh/view/${this.transactionRefId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/reimbursement/${this.reimbId}/${this.injuryId}`
            ]);
          }
        } else {
          {
            this.router.navigate([
              `home/oh/view/${this.transactionRefId}/${this.registrationNo}/${this.socialInsuranceNo}/${this.businessId}/reimbursement/${this.reimbId}`
            ]);
          }
        }

        break;
       case 101507:
        {
          this.router.navigate(
            [
              `home/oh/disease/${this.transactionId}/${this.socialInsuranceNo}/${this.businessId}/modify`
            ],
            { replaceUrl: true }
          );
        }
        break; 
    }
  }
}

