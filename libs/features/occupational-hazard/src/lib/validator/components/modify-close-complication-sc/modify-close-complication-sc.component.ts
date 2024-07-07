import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {
  AlertService,
  LookupService,
  ApplicationTypeToken,
  RouterDataToken,
  LanguageToken,
  RouterData,
  LovList,
  BilingualText,
  markFormGroupTouched
} from '@gosi-ui/core';
import { InjuryService, OhService } from '../../../shared/services';
import { BehaviorSubject } from 'rxjs';
import { Injury } from '../../../shared';
import { Location } from '@angular/common';

@Component({
  selector: 'oh-modify-close-complication-sc',
  templateUrl: './modify-close-complication-sc.component.html',
  styleUrls: ['./modify-close-complication-sc.component.scss']
})
export class ModifyCloseComplicationScComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    private location: Location,
    readonly modalService: BsModalService,
    readonly alertService: AlertService,
    readonly injuryService: InjuryService,
    readonly lookupService: LookupService,
    readonly ohservice: OhService,

    @Inject(RouterDataToken) readonly routerData: RouterData,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    @Inject(ApplicationTypeToken) readonly appTypeToken: string
  ) {}
  /**
   * Local Variables
   */
  complicationStatusList: LovList = new LovList([]);
  items = [];
  injuryId: number;
  disabled = false;
  lang = 'en';
  modalRef: BsModalRef;
  injuryDetails: Injury;
  closeComplicationForm: FormGroup;
  isWorkflow = false;
  isClosed = false;
  closedComplicationStatus: BilingualText;
  /**
   * Child Elements
   */
  @ViewChild('cancelComplication', { static: false })
  public cancelComplication: TemplateRef<Object>;
  /**
   * This method is for initialization tasks
   */

  ngOnInit() {
    /**
     * creating form for close injury
     */
    this.closeComplicationForm = this.createCloseComplicationForm();
    this.language.subscribe(language => (this.lang = language));

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
    this.complicationStatusList = new LovList(this.items);
  }

  /**
   * This method is to submit the complication status
   *
   */
  submitComplicationClosingDetails() {
    if (this.closeComplicationForm) {
      this.closeComplicationForm.getRawValue();
      this.isClosed = true;
      this.closedComplicationStatus = this.closeComplicationForm.get('complicationStatus').value;
      this.ohservice.setClosingstatus(this.closedComplicationStatus);
      this.ohservice.setIsClosed(this.isClosed);
      this.location.back();
    }
  }
  /**
   * Validating the close complication form
   */

  createCloseComplicationForm() {
    return this.fb.group({
      complicationStatus: this.fb.group({
        english: ['Cured With Disability'],
        arabic: ['شفاء بعجز']
      })
    });
  }
  /**
   * Method to hide modal
   */
  hideModal() {
    this.modalRef.hide();
  }
  /**
   * Route back to previous page
   */
  routeBack() {
    this.location.back();
  }

  /**
   * Validation for form
   */
  isValidForm() {
    markFormGroupTouched(this.closeComplicationForm);
    if (this.closeComplicationForm.valid) {
      return true;
    }
    return false;
  }

  /**
   * This method is to show error
   *
   */
  showError(err) {
    this.alertService.showError(err.error.message, err.error.details);
  }
  /**
   * This method is used to confirm cancellation of transaction
   */
  confirmCancel() {
    this.modalRef.hide();
    this.alertService.clearAlerts();
    this.routeBack();
  }
  /**
   * Template for cancelleation of template
   */
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelComplication, config);
  }
}
