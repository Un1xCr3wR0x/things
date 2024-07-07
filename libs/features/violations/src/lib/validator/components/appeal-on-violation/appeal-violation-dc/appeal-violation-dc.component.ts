import { Component, Inject, Input, OnInit } from '@angular/core';
import { DocumentItem, LanguageToken } from "@gosi-ui/core";
import { ViolationRouteConstants, ViolationTransaction } from "@gosi-ui/features/violations";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'appeal-violation-dc',
  templateUrl: './appeal-violation-dc.component.html',
  styleUrls: ['./appeal-violation-dc.component.scss']
})
export class AppealViolationDcComponent implements OnInit {
  lang: string;
  constructor(readonly router: Router, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) { }
  @Input() transactionDetails: ViolationTransaction;
  @Input() referenceNumber: number;
  @Input() documentList: DocumentItem[] = [];

  ngOnInit(): void {
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }

  //Method to navigate violation details
  navigateToViolationDetails(violationId: number) {
    const regNo = this.transactionDetails.establishmentInfo.registrationNo;
    let url = '';
    url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_VIOLATIONS_PROFILE(violationId, regNo);
    window.open(url, '_blank');
  }

  //Method to navigate violation details
  navigateToTransactionTracking(referenceNumber: number) {
    let url = '';
    url = '/establishment-private/#' + ViolationRouteConstants.ROUTE_FOR_TRANSACTION_TRACKING(referenceNumber);
    window.open(url, '_blank');
  }
}
