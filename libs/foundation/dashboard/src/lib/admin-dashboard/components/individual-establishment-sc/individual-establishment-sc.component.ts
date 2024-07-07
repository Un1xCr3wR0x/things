/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Inject } from '@angular/core';
import { BilingualText, LanguageToken, BaseComponent, Establishment } from '@gosi-ui/core';
import { Location } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from '../../services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dsb-individual-establishment-sc',
  templateUrl: './individual-establishment-sc.component.html',
  styleUrls: ['./individual-establishment-sc.component.scss']
})
export class IndividualEstablishmentScComponent extends BaseComponent implements OnInit {
  //local variables
  establishmentList = [
    { name: 'Establishment A' },
    { name: 'Establishment A', count: 5 },
    { name: 'Establishment B', count: 4 },
    { name: 'Establishmet C', count: 1 }
  ];
  billDetails = [
    { amount: 25500, type: { english: 'Adjustments', arabic: 'التسويات' } },
    { amount: 8000, type: { english: 'Contributions', arabic: 'الاشتراكات' } }
  ];
  occupationalDetails = { inProgress: 1, underTreatment: 2, missingDays: 8 };
  monthlyView = [
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 2 }],
      component: { english: 'January', arabic: 'January' },
      background: '#006AA7'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 3 }],
      component: { english: 'February', arabic: 'February' },
      background: '#006AA7'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 5 }],
      component: { english: 'March', arabic: 'March' },
      background: '#FFA200'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 2 }],
      component: { english: 'April', arabic: 'March' },
      background: '#006AA7'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 10 }],
      component: { english: 'May', arabic: 'March' },
      background: '#FFA200'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 25 }],
      component: { english: 'June', arabic: 'March' },
      background: '#FF4040'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 15 }],
      component: { english: 'July', arabic: 'March' },
      background: '#FF4040'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 10 }],
      component: { english: 'August', arabic: 'March' },
      background: '#FFA200'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 3 }],
      component: { english: 'September', arabic: 'March' },
      background: '#006AA7'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 17 }],
      component: { english: 'October', arabic: 'March' },
      background: '#FF4040'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 10 }],
      component: { english: 'November', arabic: 'March' },
      background: '#FFA200'
    },
    {
      monthlyView: [{ period: { english: '', arabic: '' }, count: 5 }],
      component: { english: 'December', arabic: 'March' },
      background: '#006AA7'
    }
  ];
  quickLinks = {
    quickLinks: [
      {
        link: { english: 'Modify Engagement Details', arabic: 'Modify Engagement Details' }
      },
      {
        link: { english: 'GOSI Certificate', arabic: 'GOSI Certificate' }
      },
      {
        link: { english: 'Register Contributor', arabic: 'Register Contributor' }
      },
      {
        link: { english: 'Terminate Engagement', arabic: 'Terminate Engagement' }
      },
      {
        link: { english: 'Report OH', arabic: 'إبلاغ عن أخطار مهنية' }
      }
    ],
    isFailure: false,
    hasMoreThanFiveLinks: false
  };
  engagements = [
    { count: 500, nationality: { english: 'Saudi', arabic: 'سعودي' } },
    { count: 250, nationality: { english: 'Non Saudi', arabic: 'غير السعودي' } }
  ];
  recentActivityList = [
    {
      title: { english: 'Register Contributor', arabic: 'Register Contributor' },
      description: {
        english: 'Contributor name (NIN XXXXXXX) Establishment name (Reg. XXXX)',
        arabic: 'Contributor name (NIN XXXXXXX) Establishment name (Reg. XXXX)'
      },
      status: { english: 'In Progress', arabic: 'In Progress' },
      createdDate: {
        gregorian: new Date('2020-07-24T08:23:53.000Z'),
        hijiri: '1441-12-03'
      },
      date: 'Wed Aug 04 2021 19:10:02 GMT+0300'
    }
  ];
  lang = 'en';
  selectedEstablishment: BilingualText = { arabic: 'Establishment 1', english: 'Establishment 1' };
  establishmentLocation: BilingualText = { arabic: 'Riyadh', english: 'Riyadh' };
  registrationNo: number;
  establishmentDetails: Establishment = new Establishment();
  constructor(
    readonly location: Location,
    readonly route: ActivatedRoute,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly dashboardService: DashboardService
  ) {
    super();
  }
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.registrationNo = +this.route.snapshot.paramMap.get('branchid');
    this.language.pipe(takeUntil(this.destroy$)).subscribe(lang => (this.lang = lang));
    this.getEstablishmentDetails();
  }
  /**
   * method to get searched establishment results
   */
  getEstablishmentDetails() {
    this.dashboardService
      .getEstablishmentDetails(this.registrationNo)
      .subscribe((establishmentDetails: Establishment) => {
        this.establishmentDetails = establishmentDetails;
      });
  }
  /**
   * location back
   */
  onBack() {
    this.location.back();
  }
}
