import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertService, WorkflowService } from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { incorrectRoute } from '../../../manage-admin/components';
import {
  CertificateEligibiltyWrapper,
  CertificateEnum,
  CertificateIneligibility,
  RequestCertificateService,
  WindowSizeService
} from '../../../shared';
import { EstablishmentScBaseComponent } from '../../../shared/base/establishment-sc.base-component';

@Component({
  selector: 'est-certificate-ineligibility-sc',
  templateUrl: './certificate-ineligibility-sc.component.html',
  styleUrls: ['./certificate-ineligibility-sc.component.scss']
})
export class CertificateIneligibilityScComponent extends EstablishmentScBaseComponent implements OnInit {
  heading = 'ESTABLISHMENT.GOSI-INELIGIBILITY';
  regNo: number = undefined;
  certificateType: CertificateEnum;
  totalReasons = 10;
  reasons: CertificateIneligibility[] = [];
  itemsPerPage = 6;
  pageDetails = {
    currentPage: 1,
    goToPage: 1
  };

  currentPage = 1;
  paginationId = 'certificateReasons';
  isMain = false;

  constructor(
    readonly bsModalService: BsModalService,
    workflowService: WorkflowService,
    readonly route: ActivatedRoute,
    readonly alertService: AlertService,
    readonly requestService: RequestCertificateService,
    readonly location: Location,
    readonly windowService: WindowSizeService
  ) {
    super(bsModalService, workflowService);
  }

  ngOnInit(): void {
    this.initialise().subscribe();
  }

  initialise(): Observable<CertificateEligibiltyWrapper> {
    return this.hasRegNoAndType(this.route.paramMap.pipe(take(1)), this.route.queryParamMap.pipe(take(1))).pipe(
      tap(() => {
        if (this.certificateType === CertificateEnum.ZAKAT && this.isMain) {
          this.heading = 'ESTABLISHMENT.ZAKAT-INELIGIBILITY-MAIN';
        } else if (this.certificateType === CertificateEnum.ZAKAT_GROUP) {
          this.heading = 'ESTABLISHMENT.ZAKAT-INELIGIBILITY-GROUP';
        } else if (this.certificateType === CertificateEnum.ZAKAT) {
          this.heading = 'ESTABLISHMENT.ZAKAT-INELIGIBILITY';
        } else if (this.certificateType === CertificateEnum.OH_CERT) {
          this.heading = 'ESTABLISHMENT.OH-INELIGIBILITY';
        }
      }),
      switchMap(() =>
        this.requestService.getCertificateEligibilty(this.regNo, { certificateType: this.certificateType }, false).pipe(
          tap(res => {
            this.reasons = res?.certificate;
            this.totalReasons = this.reasons?.length;
          })
        )
      ),
      catchError(err => {
        this.alertService.showError(err?.error?.message, err?.error?.details);
        return of(null);
      })
    );
  }

  //Check if valid route
  hasRegNoAndType(paramMap$: Observable<ParamMap>, queryParamMap$: Observable<ParamMap>): Observable<boolean> {
    return forkJoin([paramMap$, queryParamMap$]).pipe(
      switchMap((res): Observable<boolean> => {
        if (res[0]?.get('registrationNo') && res[1]?.get('certificateType')) {
          this.regNo = Number(res[0]?.get('registrationNo'));
          this.certificateType = res[1]?.get('certificateType') as CertificateEnum;
          this.isMain = res[1]?.get('isMain') === 'true';
          return of(true);
        }
        return throwError(incorrectRoute);
      })
    );
  }

  navigateBack() {
    this.location.back();
  }

  selectPage(pageNo: number) {
    this.pageDetails.currentPage = this.currentPage = pageNo;
  }
}
