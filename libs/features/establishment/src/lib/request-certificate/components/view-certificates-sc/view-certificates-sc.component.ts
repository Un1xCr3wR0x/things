import { Location } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeEnum,
  ApplicationTypeToken,
  AuthTokenService,
  EstablishmentProfile,
  FileType,
  RoleIdEnum,
  WorkflowService,
  downloadFile
} from '@gosi-ui/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, forkJoin, iif, noop, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { incorrectRoute } from '../../../manage-admin/components';
import {
  CertificateEligibiltyWrapper,
  CertificateEnum,
  CertificateIdentifierEnum,
  CertificateResponse,
  EstablishmentConstants,
  EstablishmentKeyEnum,
  EstablishmentRoutingService,
  EstablishmentService,
  isEstMain
} from '../../../shared';
import { EstablishmentScBaseComponent } from '../../../shared/base/establishment-sc.base-component';
import { RequestCertificateService } from '../../../shared/services/request-certificate.service';

@Component({
  selector: 'est-view-certificates-sc',
  templateUrl: './view-certificates-sc.component.html',
  styleUrls: ['./view-certificates-sc.component.scss']
})
export class ViewCertificatesScComponent extends EstablishmentScBaseComponent implements OnInit, OnDestroy {
  registrationNo: number;
  establishmentProfile: EstablishmentProfile;
  certificateType = CertificateEnum;
  gosiEligible = false;
  zakatEligible = false;
  zakatGroupEligible = false;
  OHCertEligible = false;
  isMain = false;
  eligibiltyStatus = [];
  hasBranches: boolean;
  generationInProgress = false;
  userRoles: number[];
  @ViewChild('unauthorizedToGenerateCertificateTemplate', { static: true })
  unauthorizedToGenerateCertificateTemplate: TemplateRef<HTMLElement>;
  isGOL: boolean;
  isPpa: boolean;
  constructor(
    readonly bsModalService: BsModalService,
    readonly workflowService: WorkflowService,
    readonly router: Router,
    readonly route: ActivatedRoute,
    readonly establishmentService: EstablishmentService,
    readonly requestService: RequestCertificateService,
    readonly location: Location,
    readonly alertService: AlertService,
    readonly authTokenService: AuthTokenService,
    readonly routingService: EstablishmentRoutingService,
    @Inject(ApplicationTypeToken) readonly appToken: ApplicationTypeEnum
  ) {
    super(bsModalService, workflowService);
  }

  ngOnInit(): void {
    this.getRegistrationNoFromRoute(this.route.paramMap)
      .pipe(
        switchMap(regNo =>
          this.establishmentService.getEstablishmentProfileDetails(regNo).pipe(
            tap(res => {
              this.establishmentProfile = res;
              if (this.establishmentProfile.registrationNo) {
                this.getPpaForCertificate();
              }
            })
          )
        ),
        tap(() => {
          this.isMain = isEstMain(this.establishmentProfile);
          this.hasBranches = this.establishmentProfile.noOfBranches > 1;
        }),
        switchMap(() => this.getCertificateEligibility())
      )
      .subscribe(noop, err => this.alertService.showError(err?.error?.message));
    if (this.appToken === ApplicationTypeEnum.PUBLIC) {
      this.isGOL = true;
    }
  }
  getPpaForCertificate() {
    this.establishmentService
      .getEstablishment(this.establishmentProfile.registrationNo, { includeMainInfo: true })
      .subscribe(res => {
        this.isPpa = res?.ppaEstablishment;
        return of(res);
      });
  }
  getRegistrationNoFromRoute(paramMap: Observable<ParamMap>): Observable<number> {
    return paramMap.pipe(
      switchMap(param =>
        iif(
          () => (param?.get('registrationNo') ? true : false),
          of(Number(param?.get('registrationNo'))),
          throwError(incorrectRoute)
        )
      ),
      tap(regNo => (this.registrationNo = regNo))
    );
  }
  getCertificateEligibility(): Observable<Array<CertificateEligibiltyWrapper>> {
    this.eligibiltyStatus = [];
    const eligible$ = this.routingService.previousUrl$.pipe(
      take(1),
      map(url => {
        if (url?.indexOf('profile') !== -1) {
          return true;
        }
        return false;
      }),
      switchMap(callApi => {
        return forkJoin(
          Object.values(this.certificateType)
            .filter(item => (item === this.certificateType.ZAKAT_GROUP ? this.isMain && this.hasBranches : true))
            .map(value => {
              return this.requestService
                .getCertificateEligibilty(this.establishmentProfile.registrationNo, { certificateType: value }, callApi)
                .pipe(
                  catchError(err => {
                    this.alertService.showError(err?.error?.message, err?.error?.details);
                    return of(new CertificateEligibiltyWrapper());
                  }),
                  tap(() => {
                    this.eligibiltyStatus.push(value);
                  })
                );
            })
        );
      }),
      tap(res => {
        this.gosiEligible = res[0]?.isEligible;
        this.zakatEligible = res[1]?.isEligible;
        this.zakatGroupEligible = res[3]?.isEligible;
        this.OHCertEligible = res[2]?.isEligible;
      })
    );
    return eligible$;
  }
  cancelTransaction() {
    this.location.back();
  }
  showEligibiltyCriteria(certificateType: string) {
    this.alertService.clearAlerts();
    const navigationExtras: NavigationExtras = {
      queryParams: { certificateType: certificateType, isMain: this.isMain }
    };
    this.router.navigate([EstablishmentConstants.CERTIFICATE_ELIGIBILITY_ROUTE(this.registrationNo)], navigationExtras);
  }
  generate(certificateType: CertificateEnum) {
    this.alertService.clearAlerts();
    if (this.appToken === ApplicationTypeEnum.PRIVATE && !this.isUserAllowedToGenerateCertificate()) {
      return this.showModal(this.unauthorizedToGenerateCertificateTemplate);
    }
    if (this.appToken === ApplicationTypeEnum.PUBLIC && certificateType === CertificateEnum.GOSI) {
      this.generateDocument();
    } else {
      let route = EstablishmentConstants.GOSI_CERTIFICATE_ROUTE(this.registrationNo);
      if (certificateType === CertificateEnum.ZAKAT) {
        if (this.isMain) {
          route = EstablishmentConstants.ZAKAT_CERTIFICATE_MAIN_ROUTE(this.registrationNo);
        } else {
          route = EstablishmentConstants.ZAKAT_CERTIFICATE_ROUTE(this.registrationNo);
        }
      } else if (certificateType === CertificateEnum.ZAKAT_GROUP) {
        route = EstablishmentConstants.ZAKAT_CERTIFICATE_GROUP_ROUTE(this.registrationNo);
      } else if (certificateType === CertificateEnum.OH_CERT) {
        route = EstablishmentConstants.OH_CERTIFICATE_ROUTE(this.registrationNo);
      }
      this.router.navigate([route]);
    }
  }

  generateDocument() {
    this.downloadCertificate().subscribe();
  }

  downloadCertificate(): Observable<CertificateResponse> {
    if (this.generationInProgress) {
      return of(null);
    }
    this.generationInProgress = true;
    return this.requestService
      .getCertificateDetails(this.registrationNo, { type: CertificateIdentifierEnum.GOSI, isGroupCertificate: false })
      .pipe(
        switchMap(res => {
          return this.requestService.generateCertificate(this.registrationNo, res?.certificateNo).pipe(
            tap(fileData => {
              downloadFile(fileData?.fileName, FileType.pdf, fileData?.blob);
            })
          );
        }),
        tap(() => {
          this.alertService.showSuccessByKey(EstablishmentKeyEnum.GENERATE_CERT_SUCCESS);
        }),
        catchError(err => {
          this.alertService.showError(err?.error?.message, err?.error?.details);
          return of(null);
        }),
        tap(() => {
          this.generationInProgress = false;
        })
      );
  }

  /**
   *
   * @returns true if Front Office user is allowed to generate a certificate
   */
  isUserAllowedToGenerateCertificate(): boolean {
    const allowedRoles: RoleIdEnum[] = EstablishmentConstants.GENERATE_CERTIFICATE_ACCESS_ROLES;
    const gosiscp = this.authTokenService.getEntitlements();

    this.userRoles = gosiscp?.length > 0 ? gosiscp?.[0]?.role : [];
    return this.userRoles.some(role => allowedRoles.includes(role));
  }

  ngOnDestroy() {
    this.alertService.clearAlerts();
  }
}
