import { Component, OnInit } from '@angular/core';
import { CustomerSurveyService } from '../../../shared/services/customer-survey.service';
import { UserActivityService } from '../../../shared';
import { SurveyDetails } from '../../../shared/models/survey';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cs-survey-sc',
  templateUrl: './survey-sc.component.html',
  styleUrls: ['./survey-sc.component.scss']
})
export class SurveyScComponent implements OnInit {
  surveyDetails: SurveyDetails;
  show: any;
  public destroy$: Subject<boolean> = new Subject();
  isExpired: any;
  surveyNo: any;
  message: any;
  isCompleted: boolean;
  constructor(private surveySurvice: CustomerSurveyService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const url = this.router.url;
    const pathParts = url.split('/');
    this.surveyNo = pathParts[pathParts.length - 1];
    //this.getContractReferenceID();

    this.getDetails();
  }
  getContractReferenceID() {
    this.initialiseFromRoute().subscribe();
  }

  initialiseFromRoute() {
    return this.route.queryParams.pipe(
      tap(params => {
        if (params['survey-number']) {
          this.surveyNo = params['survey-number'];
        }
      })
    );
  }
  getDetails() {
    this.surveySurvice
      .getSurveyDetails(this.surveyNo)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        res => {
          this.surveyDetails = res;
          this.show = true;
        },
        error => {
          this.show = true;

          if (error?.error?.code == 'SUR-ERR-4001' || error?.error?.code == 'SUR-ERR-4003') {
            this.show = true;
            this.message = error.error.message;
            this.isExpired = true;
            this.isCompleted = false;
          }
          if (error?.error?.code == 'SUR-ERR-4002') {
            this.show = true;
            this.message = error.error.message;
            this.isExpired = false;
            this.isCompleted = true;
          }
        }
      );
  }
}
