import { Component, OnInit, Inject } from '@angular/core';
import { Benefits, DependentDetails, AmountDetails, PaymentDetails } from '../../../shared/models';
import { TransactionsService } from '../../../shared/services/transactions.service';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'bnt-request-unemployment-sc',
  templateUrl: './request-unemployment-sc.component.html',
  styleUrls: ['./request-unemployment-sc.component.scss']
})
export class RequestUnemploymentScComponent implements OnInit {
  contributorDetails = {};
  lang = 'en';
  returnLumpsumDetails = {
    reason: {
      english: 'Reason in english',
      arabic: 'Reason in arabic'
    },
    benefitAmount: '11,000 SAR',
    reqDate: '15/03/2020',
    notes: {
      english: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      arabic: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    }
  };
  heirDetails: DependentDetails[];
  eventHistory = [
    {
      date: '10/12/2020'
    },
    {
      date: '11/12/2020'
    }
  ];
  benefitDetails: Benefits;
  amountDetails: AmountDetails;
  paymentDetails: PaymentDetails;
  modificationDetails = {
    engagements: [
      {
        periodBeforeModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        periodAfterModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        wageBeforeModification: 5000,
        wageAfterModification: 6000
      },
      {
        periodBeforeModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        periodAfterModification: {
          gregorian: '2021-03-03T09:11:17.000Z',
          hijiri: '1442-06-20'
        },
        wageBeforeModification: 5000,
        wageAfterModification: 6000
      }
    ]
  };

  benefitDetailsRecalculationDueToEngagementChange = {
    benefitType: 'Heir Benefit',
    paymentDate: {
      gregorian: '2021-03-03T09:11:17.000Z',
      hijiri: '1442-06-20'
    },
    newBenefitAmount: 60000,
    amountBeforeRecalculation: 50000
  };

  constructor(
    readonly transactionService: TransactionsService,
    @Inject(LanguageToken) private language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.transactionService.getDependentDetails().subscribe(res => {
      this.heirDetails = res;
    });
    this.language.subscribe(lang => {
      this.lang = lang;
    });
  }
}
