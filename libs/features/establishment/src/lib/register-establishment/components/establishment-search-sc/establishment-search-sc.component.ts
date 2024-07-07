/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  BilingualText,
  Establishment,
  EstablishmentRouterData,
  EstablishmentToken,
  LookupService,
  Lov,
  LovList,
  RoleIdEnum,
  bindToObject,
  startOfDay,
  startOfMonth
} from '@gosi-ui/core';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import {
  AddEstablishmentService,
  ErrorCodeEnum,
  EstablishmentConstants,
  EstablishmentErrorKeyEnum,
  EstablishmentRoutesEnum,
  EstablishmentService,
  EstablishmentTypeEnum,
  OrganisationTypeEnum
} from '../../../shared';
import { EstablishmentTypeDcComponent } from '../establishment-type-dc/establishment-type-dc.component';
import { LegalEntitiesEnum } from '@gosi-ui/features/contributor/lib/shared/enums/legal-entities';

const ERR_ACTIVE_GCC_ESTABLISHMENT = EstablishmentErrorKeyEnum.DUPLICATE_GCC_EST;
const ERR_LICENSE_NUMBER_EXIST = EstablishmentErrorKeyEnum.DUPLICATE_LICENSE;
const ERR_DEPARTMENT_ID_EXIST = EstablishmentErrorKeyEnum.DUPLICATE_DEPARTMENT_ID;
@Component({
  selector: 'est-establishment-search-sc',
  templateUrl: './establishment-search-sc.component.html',
  styleUrls: ['./establishment-search-sc.component.scss']
})
export class EstablishmentSearchScComponent implements OnInit {
  /**
   * Local variables
   */
  establishment: Establishment;

  /**
   * Lov observables
   */
  licenseIssuingAuthorityList$: Observable<Lov[]>;
  organistaionTypeList$: Observable<Lov[]>;
  legalEntityList$: Observable<Lov[]>;

  legalEntityLovList$: Observable<LovList>;
  gccCountryList$: Observable<LovList>;
  establishmentTypeList$: Observable<LovList>;

  @ViewChild('organisationTypeComp', { static: false })
  organisationTypeComp: EstablishmentTypeDcComponent;

  lawTypeList$: Observable<LovList>;

  constructor(
    readonly lookUpService: LookupService,
    readonly alertService: AlertService,
    readonly addEstablishmentService: AddEstablishmentService,
    readonly establishmentService: EstablishmentService,
    readonly router: Router,
    @Inject(EstablishmentToken) readonly estToken: EstablishmentRouterData
  ) {}

  ngOnInit() {
    this.addEstablishmentService.draftRegNo = undefined;
    this.licenseIssuingAuthorityList$ = this.lookUpService.getLicenseIssueAuthorityList().pipe(
      filter(res => res !== null),
      map(lovList => lovList.items)
    );
    this.organistaionTypeList$ = this.lookUpService.getOrganistaionTypeList().pipe(
      filter(res => res !== null),
      map(lovList => lovList.items),
      map(lovs => {
        return lovs.filter(lov => {
          if (lov.value?.english === OrganisationTypeEnum.GCC) {
            return this.establishmentService.isUserEligible([RoleIdEnum.GCC_CSR]);
          }
          if (lov.value?.english !== OrganisationTypeEnum.GCC) {
            return this.establishmentService.isUserEligible([RoleIdEnum.CSR]);
          }
        });
      })
    );
    this.gccCountryList$ = this.lookUpService.getGccCountryList();
    this.establishmentTypeList$ = this.lookUpService.getEstablishmentTypeList();
    this.lawTypeList$ = this.lookUpService.getLawTypeList();
    this.addEstablishmentService.verifiedEstablishment = undefined;
    this.estToken.fromJsonToObject(new EstablishmentRouterData());
  }

  /**
   * this method is used to filter the Legal Entities corresponding to the establishment Type
   * @param establishmentType
   * @memberof AddEstablishmentSCBaseComponent
   */
  selectOrganizationType(establishmentType: string) {
    this.alertService.clearAlerts();
    this.legalEntityList$ = this.organistaionTypeList$.pipe(
      map(data => data.filter((lov: Lov) => lov.value.english === establishmentType)[0]),
      filter(res => (res ? true : false)),
      map(res => res.items)
    );
    this.licenseIssuingAuthorityList$ = this.licenseIssuingAuthorityList$.pipe(
      map(list => {
        //If the organisation type is non government filter the legal entity to international,organisation,region
        //Remove royal decree from the license issuing authority
        if (establishmentType === OrganisationTypeEnum.NON_GOVERNMENT) {
          return list.filter(
            lovList => lovList.value.english !== EstablishmentConstants.LICENCE_ISSUING_AUTH_ROYAL_DECREE
          );
        }
        return list;
      })
    );
    this.establishment = new Establishment();
    this.establishment.organizationCategory.english = establishmentType;
  }

  filterLegalEntityByLawType(establishmentType: string) {
    this.legalEntityList$ = this.lookUpService.getOrganistaionTypeList().pipe(
      map(lovList => lovList.items),
      map(data => data.filter((lov: Lov) => lov.value.english === establishmentType)[0]),
      filter(res => (res ? true : false)),
      map(data =>
        establishmentType === OrganisationTypeEnum.GCC
          ? data.items.filter(
              eachItem =>
                eachItem.value.english !== LegalEntitiesEnum.GOVERNMENT &&
                eachItem.value.english !== LegalEntitiesEnum.SEMI_GOVERNMENT
            )
          : data.items
      ),
      filter(res => (res ? true : false)),
      map(res => res)
    );
  }

  /**
   * Method to verify the non gcc establishment details
   * @param establishmentFormDetails
   */
  verifyEstablishmentDetails(establishmentFormDetails) {
    if (establishmentFormDetails) {
      this.alertService.clearAlerts();
      this.establishment = this.addEstablishmentService.setResponse(this.establishment, establishmentFormDetails);
      if (this.establishment.license) {
        if (this.establishment.license.issueDate && this.establishment.license.issueDate.gregorian) {
          this.establishment.license.issueDate.gregorian = startOfDay(this.establishment.license.issueDate.gregorian);
          this.establishment.startDate.gregorian = startOfMonth(this.establishment.license.issueDate.gregorian);
        }
        if (this.establishment.license.expiryDate && this.establishment.license.expiryDate.gregorian) {
          this.establishment.license.expiryDate.gregorian = startOfDay(this.establishment.license.expiryDate.gregorian);
        }
      }
      this.verifyEstablishment(this.establishment);
    }
  }

  /**
   * Method to call api and verify establishment is valid
   * @param establishment
   * @memberof AddEstablishmentSCBaseComponent
   */
  verifyEstablishment(establishment: Establishment) {
    this.alertService.clearAlerts();
    if (establishment.establishmentType.english === EstablishmentTypeEnum.BRANCH) {
      this.establishmentService.getEstablishment(establishment.mainEstablishmentRegNo).subscribe(
        mainEstablishment => {
          // if (mainEstablishment?.ppaEstablishment) {
          //   this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.PPA_MAIN_EST_ERROR);
          // } else {
          this.verifyEst(establishment, mainEstablishment);
          // }
        },
        () => {
          this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.NO_SUCH_MAIN);
        }
      );
    } else {
      this.verifyEst(establishment);
    }
  }

  verifyEst(establishment: Establishment, mainEstablishment?: Establishment) {
    this.addEstablishmentService
      .verifyEstablishment(
        establishment.license.number.toString(),
        establishment.license.issuingAuthorityCode.english,
        true,
        establishment.departmentNumber
      )
      .subscribe(
        res => {
          if (res) {
            const departmentIdPresent = this.addEstablishmentService.checkDepartmentIdAlreadyPresent(
              res,
              establishment.departmentNumber
            );
            if (departmentIdPresent) {
              this.alertService.showErrorByKey(ERR_DEPARTMENT_ID_EXIST);
              return;
            } else {
              if (this.addEstablishmentService.checkEstablishmentAlreadyPresent(res)) {
                this.alertService.showErrorByKey(ERR_LICENSE_NUMBER_EXIST);
                return;
              }
            }
            if (establishment.establishmentType.english === EstablishmentTypeEnum.BRANCH) {
              this.verifyBranchEstablishment(establishment, mainEstablishment);
            } else {
              this.setVerifiedEstablishmentAndNavigate(establishment);
            }
          }
        },
        err => {
          //Establishment with the license number is not available,establishment can add or check for branch
          if (err.error.code === ErrorCodeEnum.EST_NO_RECORD) {
            if (establishment.establishmentType.english === EstablishmentTypeEnum.BRANCH) {
              this.verifyBranchEstablishment(establishment, mainEstablishment);
            } else {
              this.setVerifiedEstablishmentAndNavigate(establishment);
            }
          } else {
            //fixme: handle it gglobally
            this.showErrorMessage(err);
          }
        }
      );
  }
  /**
   * This method is to validate the branch establishment with main
   *
   * @param {any} establishmentdetails
   * @memberof AddEstablishmentSCBaseComponent
   */
  verifyBranchEstablishment(establishment: Establishment, mainEstablishment: Establishment) {
    this.alertService.clearAlerts();
    // this.establishmentService.getEstablishment(establishment.mainEstablishmentRegNo).subscribe(
    //   mainEstablishment => {
    if (this.addEstablishmentService.isMainEstablishmentEligible(mainEstablishment, this.alertService)) {
      if (
        this.addEstablishmentService.validateBranchEstablishment(mainEstablishment, establishment, this.alertService)
      ) {
        this.addEstablishmentService.hasAdminForMain = false;
        this.establishmentService
          .getSuperAdminDetails(establishment.mainEstablishmentRegNo)
          .pipe(
            tap(res => {
              if (res && res !== null) {
                this.addEstablishmentService.hasAdminForMain = true;
              }
            })
          )
          .subscribe(
            () => {
              this.setVerifiedEstablishmentAndNavigate(establishment);
            },
            () => {
              this.setVerifiedEstablishmentAndNavigate(establishment);
            }
          );
      }
    }
    //   },
    //   () => {
    //     this.alertService.showErrorByKey(EstablishmentErrorKeyEnum.NO_SUCH_MAIN);
    //   }
    // );
  }

  /**
   * Method to show error messages coming from api
   * @param err
   */
  showErrorMessage(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }

  /**
   * This method is used to verify gcc establishment details
   * @param gccEstablishmentDetails
   * @memberof AddEstablishmentSCBaseComponent
   */
  verifyGCCEstablishmentDetails(GCCEstablishmentDetails) {
    if (GCCEstablishmentDetails) {
      //this.isInternational = false;
      this.establishment.gccCountry = true;
      this.establishment.legalEntity = new BilingualText();
      this.establishment.legalEntity.english = GCCEstablishmentDetails?.legalEntity?.english;
      this.establishment.legalEntity.arabic = GCCEstablishmentDetails?.legalEntity?.arabic;
      this.establishment.establishmentType.english = EstablishmentTypeEnum.MAIN;
      this.establishment.lawType = new BilingualText();
      this.establishment.lawType.english = GCCEstablishmentDetails?.lawType.english;
      this.establishment.lawType.arabic = GCCEstablishmentDetails?.lawType.arabic;
      this.establishment.departmentNumber = GCCEstablishmentDetails?.departmentNumber;
      this.establishment.gccEstablishment = bindToObject(this.establishment.gccEstablishment, GCCEstablishmentDetails);
      this.establishment.gccCountry = true;
      this.establishment.establishmentType.english = EstablishmentTypeEnum.MAIN;
      this.addEstablishmentService
        .verifyGCCEstablishmentDetails(
          this.establishment.gccEstablishment.country?.english,
          this.establishment.gccEstablishment.registrationNo,
          true,
          this.establishment.departmentNumber
        )
        .subscribe(
          res => {
            const departmentIdPresent = this.addEstablishmentService.checkDepartmentIdAlreadyPresent(
              res,
              this.establishment.departmentNumber
            );

            if (departmentIdPresent) {
              this.alertService.showErrorByKey(ERR_DEPARTMENT_ID_EXIST);
              return;
            } else {
              if (this.addEstablishmentService.checkEstablishmentAlreadyPresent(res)) {
                this.alertService.showErrorByKey(ERR_ACTIVE_GCC_ESTABLISHMENT);
                return;
              }
            }
            this.setVerifiedEstablishmentAndNavigate(this.establishment);
          },
          err => {
            //Establishment with the GCC regsitration number is not available,establishment can add or check for branch
            if (err.error.code === ErrorCodeEnum.EST_NO_RECORD) {
              this.setVerifiedEstablishmentAndNavigate(this.establishment);
            } else {
              this.showErrorMessage(err);
            }
          }
        );
    }
  }

  /**
   * Method to set the initial establishment detials from verified details
   * @param establishment
   */
  setVerifiedEstablishmentAndNavigate(establishment: Establishment) {
    this.addEstablishmentService.verifiedEstablishment = establishment;
    this.router.navigate([EstablishmentRoutesEnum.REGISTER_ESTABLISHMENT]);
  }

  /**
   * Method to show form invalid
   */
  showFormInvalid() {
    this.alertService.showMandatoryErrorMessage();
  }
}
