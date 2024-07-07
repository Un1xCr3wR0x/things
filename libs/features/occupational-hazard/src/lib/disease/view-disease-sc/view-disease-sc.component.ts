/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  DocumentService,
  LanguageToken,
  BilingualText,
  ApplicationTypeEnum,
  scrollToTop
} from '@gosi-ui/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import {
  ComplicationService,
  DiseaseService,
  InjuryService,
  OhService,
  ContributorService,
  EstablishmentService
} from '../../shared/services';
import { OhBaseScComponent } from '../../shared/component';
import { Location } from '@angular/common';
import { OHReportTypes, InjuryStatus, Route, TabSetVariables } from '../../shared';
import { tap } from 'rxjs/operators';
import { DiseaseWrapper } from '../../shared/models/disease-wrapper';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'oh-view-disease-sc',
  templateUrl: './view-disease-sc.component.html',
  styleUrls: ['./view-disease-sc.component.scss']
})
export class ViewDiseaseScComponent extends OhBaseScComponent implements OnInit {
  selectedType: OHReportTypes = null;
  showComplication = false;
  diseaseDetailsWrapper: DiseaseWrapper = new DiseaseWrapper();
  errorMessage = '';
  decompressedString: string;
  dismissible = false;
  diseaseStatus: BilingualText;
  modalHeader = '';
  tabView = false;
  statusEst: string;
  collapse = false;
  bsModalRef: BsModalRef;
  @ViewChild('errorTemplate', { static: true })
  errorTemplate: TemplateRef<HTMLElement>;

  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly alertService: AlertService,
    readonly establishmentService: EstablishmentService,
    readonly contributorService: ContributorService,
    readonly fb: FormBuilder,
    readonly documentService: DocumentService,
    readonly injuryService: InjuryService,
    readonly ohService: OhService,
    readonly complicationService: ComplicationService,
    readonly diseaseService: DiseaseService,
    readonly router: Router,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly location: Location,
    readonly bsModalService: BsModalService,
    readonly activatedRoute: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    super(
      language,
      alertService,
      contributorService,
      documentService,
      establishmentService,
      injuryService,
      ohService,
      router,
      fb,
      complicationService,
      diseaseService,
      location,
      appToken
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.ohService.setNavigation(null);
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.status === 'modified' || params.status === 're-open' || params.status === 'rejected') {
        this.hasModifyIndicator = true;
      }
    });
    this.registrationNo = this.ohService.getRegistrationNumber();
    this.socialInsuranceNo = this.ohService.getSocialInsuranceNo();
    this.diseaseId = this.ohService.getDiseaseId();
    this.ohService.setSelectedTabid(TabSetVariables.Injury);
    if (!this.diseaseId) {
      this.activatedRoute.paramMap.subscribe(res => {
        this.registrationNo = parseInt(res.get('registrationNo'), 10);
        this.socialInsuranceNo = parseInt(res.get('socialInsuranceNo'), 10);
        this.diseaseId = parseInt(res.get('diseaseId'), 10);
      });
    }
    this.selectedType = this.ohService.getReportType();
    if (OHReportTypes.Complication === this.selectedType) {
      this.showComplication = true;
    }
    if (!this.hasModifyIndicator) {
      this.alertService.clearAlerts();
    }
    this.getDisease(true);
    this.getEstablishment();
    this.getContributor();
    scrollToTop();
    if(this.ohService.getCurrentPath()){
      this.ohService.setPreviousPath(this.ohService.getCurrentPath());      
    }
    this.ohService.setCurrentPath(this.router.url);
  }

  /**
   * Method to Set RegistrationNo,InjuryId ans SIN to Ohservice
   */
  setServiceVariables() {
    // this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setDiseaseId(this.diseaseId);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
  }

  /**
   * Event while clicking Reopen button
   */
  reopenDiseaseTransaction() {
    this.router.navigate([`home/oh/disease/re-open`]);
  }

  /**
   * Method to show modal
   * @param template
   */
  showModal(modalRef: TemplateRef<HTMLElement>, size?: string): void {
    const config = {};
    if (size) {
      Object.assign(config, { class: 'modal-' + size });
    }
    this.bsModalRef = this.bsModalService.show(modalRef, config);
  }
  /**
   * Method to cancel the transaction
   */
  clearModal() {
    this.bsModalRef.hide();
    if (this.dismissible) {
      this.router.navigate([`home/oh/injury/reopen`]);
    }
  }

  getDisease(document?) {
    const isChangeRequired = false;
    this.diseaseService
      .getDiseaseDetails(
        this.registrationNo,
        this.socialInsuranceNo,
        this.diseaseId,
        this.isAppPublic,
        isChangeRequired
      )
      .pipe(
        tap(res => {
          this.diseaseDetailsWrapper = res;
          this.ohService.setDiseasestatus(this.diseaseDetailsWrapper?.diseaseDetailsDto?.status);
          this.disease = res.diseaseDetailsDto;
          // this.disease.diseaseDescription = this.disease.diseaseDescriptionArray.join(',');
          this.tpaCode = this.disease.tpaCode;
          this.idCode = this.getISDCodePrefix(this.disease.emergencyContactNo);
          if (this.diseaseDetailsWrapper.isTransferredInjury === true) {
            this.isTransferredInjury = true;
            this.transferInjuryId=this.diseaseDetailsWrapper.transferredInjuryid;
          } else {
            this.isTransferredInjury = false;
          }
        })
      )
      .subscribe(
        () => {
          if (document) {
            this.documentService.getOldDocuments(this.disease.diseaseId).subscribe(documentResponse => {
              this.documents = documentResponse.filter(item => item.documentContent !== null);
              this.documentService
                .getOldDocuments(this.diseaseDetailsWrapper.transferredInjuryid)
                ?.subscribe(documentResponse => {
                  if (documentResponse) {
                    let docs = documentResponse.filter(item => item.documentContent !== null);
                    if (docs && docs.length > 0) {
                      docs.forEach(element => {
                        this.documents.push(element);
                      });
                    }
                  }
                });
            });
            if (this.isAppPrivate) {
              this.getRasedDocuments(this.diseaseDetailsWrapper.diseaseDetailsDto);
            }
          }
        },
        err => {
          this.showError(err);
        }
      );
  }
  viewInjuryDetails(){
    this.setDiseaseParams();
    this.router.navigate([
      `home/oh/view/${this.registrationNo}/${this.socialInsuranceNo}/${this.transferInjuryId}/injury/info`
    ]);
  }
  setDiseaseParams() {
    this.ohService.setRegistrationNo(this.registrationNo);
    this.ohService.setSocialInsuranceNo(this.socialInsuranceNo);
    this.ohService.setInjuryId(this.transferInjuryId);     // for transfer injury scenario
    this.ohService.setTransferInjuryId(this.transferInjuryId);
  }

  getDiseaseDetailsFromJson() {
    this.httpClient.get('../assets/data/disease-details.json').subscribe(data => {
      this.diseaseDetails = data;
      this.disease = this.diseaseDetails.diseaseDetailsDto;
      console.log(this.disease);
    });
  }
}
