import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AlertService,
  ApplicationTypeToken,
  BilingualText,
  LanguageToken,
  LookupService,
  LovList,
  RouterData,
  RouterDataToken,
  markFormGroupTouched
} from '@gosi-ui/core';
import { DiseaseService, OhService } from '@gosi-ui/features/occupational-hazard/lib/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'oh-modify-close-disease-sc',
  templateUrl: './modify-close-disease-sc.component.html',
  styleUrls: ['./modify-close-disease-sc.component.scss']
})
export class ModifyCloseDiseaseScComponent implements OnInit {
  closeDiseaseForm: FormGroup;
  diseaseStatusList: LovList = new LovList([]);
  items = [];
  diseaseId: number;
  lang = 'en';
  modalRef: BsModalRef;
  closedDiseaseStatus: BilingualText;
  isClosed = false;

  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    private location: Location,
    private modalService: BsModalService,
    private alertService: AlertService,
    readonly lookupService: LookupService,
    readonly ohservice: OhService,

    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appTypeToken: string
  ) {}
  /**
   * Child Elements
   */
  @ViewChild('cancelDisease', { static: false })
  private cancelDisease: TemplateRef<Object>;

  ngOnInit(): void {
    this.closeDiseaseForm = this.createCloseDiseaseForm();
    this.language.subscribe(language => (this.lang = language));
    if (this.routerData.payload != null) {
      const payload = JSON.parse(this.routerData.payload);
      this.diseaseId = payload.diseaseId;
    }

    this.items.push({
      value: {
        english: 'Cured With Disability',
        arabic: 'شفاء بعجز'
      },
      sequence: 1002
    });
    this.items.push({
      value: {
        english: 'Cured Without Disability',
        arabic: 'شفاء بدون عجز'
      },
      sequence: 1001
    });
    this.diseaseStatusList = new LovList(this.items);
  }

  createCloseDiseaseForm() {
    return this.fb.group({
      diseaseStatus: this.fb.group({
        english: ['Cured With Disability'],
        arabic: ['شفاء بعجز']
      })
    });
  }

  confirmCancel() {
    this.modalRef.hide();
    this.alertService.clearAlerts();
    this.routeBack();
  }

  hideModal() {
    this.modalRef.hide();
  }

  /**
   * Route back to previous page
   */
  routeBack() {
    this.location.back();
  }

  submitDiseaseClosingDetails() {
    if (this.closeDiseaseForm) {
      this.closeDiseaseForm.getRawValue();
      this.isClosed = true;
      this.closedDiseaseStatus = this.closeDiseaseForm.get('diseaseStatus').value;
      this.ohservice.setClosingstatus(this.closedDiseaseStatus);
      this.ohservice.setIsClosed(this.isClosed);
      this.location.back();
    }
  }

  /**
   * Validation for form
   */
  isValidForm() {
    markFormGroupTouched(this.closeDiseaseForm);
    if (this.closeDiseaseForm.valid) {
      return true;
    }
    return false;
  }

  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelDisease, config);
  }
}
