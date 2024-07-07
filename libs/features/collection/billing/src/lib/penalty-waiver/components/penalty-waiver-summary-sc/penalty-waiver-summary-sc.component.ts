import { Component, Inject, OnInit } from '@angular/core';
import { LanguageToken, AlertService, RegistrationNoToken, RegistrationNumber } from '@gosi-ui/core';
import { BehaviorSubject, noop, throwError } from 'rxjs';
import { PenalityWavierService } from '../../../shared/services';
import { catchError, tap } from 'rxjs/operators';
import { WaiverSummaryDetails } from '../../../shared/models';
import { Location } from '@angular/common';
import { RouteConstants } from '../../../shared/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'blg-penalty-waiver-summary-sc',
  templateUrl: './penalty-waiver-summary-sc.component.html',
  styleUrls: ['./penalty-waiver-summary-sc.component.scss']
})
export class PenaltyWaiverSummaryScComponent  implements OnInit {
  /**-----------------Local Variables-------------------- */
  lang = 'en';
  idNumber: number;
  waiverDetails: WaiverSummaryDetails;
  isGosiInitiative = false;
  /**
   * 
   * @param language 
   * @param penalityWavierService 
   * @param alertService 
   */
  constructor( @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
  readonly penalityWavierService: PenalityWavierService,
  readonly alertService: AlertService,
  @Inject(RegistrationNoToken) readonly establishmentRegistrationNo: RegistrationNumber,
  readonly location: Location,
  readonly router: Router) {}
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    this.idNumber = this.establishmentRegistrationNo.value;
    this.getWaiverDetails();
  }
  getWaiverDetails() {
    this.penalityWavierService
    .getWaiverSummaryDetails(this.idNumber)
    .pipe
    (tap(res => {
      this.waiverDetails = res;
      res.penaltyWaiverHistoryDetails.forEach(item => {
        if(item.waiveOffType.english === 'GOSI Initiative to Waive Penalties') {
        this.isGosiInitiative = true;
        }  
      })

      }),
      catchError(err => {
        this.alertService.showError(err.error.message);
        this.handleError(err);
        return throwError(err);
      })
    ).subscribe(noop,noop);
    
}
 /**
   * Method to handle error
   * @param error
   */
 handleError(error) {
  this.alertService.showError(error.error.message);
}
  navigateToSummary() {
    this.location.back();
}
  }

