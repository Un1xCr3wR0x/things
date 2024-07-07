import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ApplicationTypeToken,
  LovList,
  markFormGroupTouched,
  LanguageToken,
  AlertService,
  LookupService,
  RouterData,
  RouterDataToken,
  BilingualText
} from '@gosi-ui/core';

import { BehaviorSubject } from 'rxjs';
import { Location } from '@angular/common';
import { Injury, InjuryService, OhService } from '../../../shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'oh-modify-close-injury-sc',
  templateUrl: './modify-close-injury-sc.component.html',
  styleUrls: ['./modify-close-injury-sc.component.scss']
})
export class ModifyCloseInjuryScComponent implements OnInit {
  /**
   *
   * @param fb Creating an instance
   * @param router
   */

  constructor(
    private fb: FormBuilder,
    readonly router: Router,
    private location: Location,
    private modalService: BsModalService,
    private alertService: AlertService,
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
  injuryStatusList: LovList = new LovList([]);
  items = [];
  injuryId: number;
  disabled = false;
  lang = 'en';
  modalRef: BsModalRef;
  injuryDetails: Injury;
  closeInjuryForm: FormGroup;
  isWorkflow = false;
  isClosed = false;
  closedInjuryStatus: BilingualText;
  /**
   * Child Elements
   */
  @ViewChild('cancelInjury', { static: false })
  private cancelInjury: TemplateRef<Object>;
  /**
   * This method is for initialization tasks
   */

  ngOnInit() {
    /**
     * creating form for close injury
     */
    this.closeInjuryForm = this.createCloseInjuryForm();
    this.language.subscribe(language => (this.lang = language));
    if (this.routerData.payload != null) {
      const payload = JSON.parse(this.routerData.payload);
      this.injuryId = payload.id;
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
    this.injuryStatusList = new LovList(this.items);
  }

  /**
   * Validating the close injury form
   */

  createCloseInjuryForm() {
    return this.fb.group({
      injuryStatus: this.fb.group({
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
    markFormGroupTouched(this.closeInjuryForm);
    if (this.closeInjuryForm.valid) {
      return true;
    }
    return false;
  }
  /**
   *  template for cancel
   */
  showCancelTemplate() {
    const config = { backdrop: true, ignoreBackdropClick: true };
    this.modalRef = this.modalService.show(this.cancelInjury, config);
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
   * This method is to submit the injury status
   *
   */
  submitInjuryClosingDetails() {
    if (this.closeInjuryForm) {
      this.closeInjuryForm.getRawValue();
      this.isClosed = true;
      this.closedInjuryStatus = this.closeInjuryForm.get('injuryStatus').value;
      this.ohservice.setClosingstatus(this.closedInjuryStatus);
      this.ohservice.setIsClosed(this.isClosed);
      this.location.back();
    }
  }
}
