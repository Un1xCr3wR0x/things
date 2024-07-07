/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BilingualText, convertToStringDDMMYYYY, LanguageToken, LookupService, LovList, Person } from '@gosi-ui/core';
import { AddressDcComponent } from '@gosi-ui/foundation/form-fragments';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustodyDetails } from '../../../shared';

@Component({
  selector: 'cnt-add-authorization-custodian-details-dc',
  templateUrl: './add-authorization-custodian-details-dc.component.html',
  styleUrls: ['./add-authorization-custodian-details-dc.component.scss']
})
export class AddAuthorizationCustodianDetailsDcComponent implements OnInit, OnChanges {
  @Input() isEditMode = false;
  @Input() isAttorney = true;
  @Input() person;
  @Input() authDetails: CustodyDetails;
  @Input() authSource = { arabic: 'وزارة العدل', english: 'Ministry of Justice' };
  @Input() minorsNames = [];
  @Input() minorsType = new FormArray([]);
  @Output() onNext: EventEmitter<null> = new EventEmitter();
  @Output() onPrevious: EventEmitter<void> = new EventEmitter();
  @Output() onCancel: EventEmitter<null> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();

  authNumber;
  authIssueDate;
  authList;
  modalRef: BsModalRef;
  addressForms = new FormGroup({});
  age: number = null;
  dateOfBirth: BilingualText = new BilingualText();
  lang = 'en';
  minorTypeList = [];

  @ViewChild('addressDetails', { static: false })
  addressDcComponent: AddressDcComponent;
  @ViewChild('custodyTextIframe')
  custodyTextIframe: ElementRef;

  person$: Observable<Person>;
  personId: number;

  // LovLists
  nationalityList: Observable<LovList>;
  educationList: Observable<LovList>;
  specializationList: Observable<LovList>;
  cityList: Observable<LovList>;
  countryList: Observable<LovList>;

  /**Creates an instance of CancelVicDetailsDcComponent. */
  constructor(
    private modalService: BsModalService,
    private lookupService: LookupService,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  /**Creates an instance of AddAuthorizationCustodianDetailsDcComponent. */

  ngOnInit(): void {
    if (this.authDetails) {
      if (this.authDetails.custodian) {
        this.authNumber = this.authDetails.custodyNumber;
        this.authIssueDate = this.authDetails.custodyDate;
        this.authList = this.authDetails.minorList;
      }
    }
    this.countryList = this.lookupService.getGccCountryList();
    this.cityList = this.lookupService.getCityList();
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.authDetails) {
      this.authDetails.minorList.forEach(minor => {
        this.minorTypeList.push(this.getMinorTypeList(minor));
      });
    }
  }

  saveCustodyDetails() {
    this.onNext.emit();
  }

  goToPreviousSection() {
    this.onPrevious.emit();
  }

  /**
   * Method to show a confirmation popup for reseting the form.
   * @param template template
   */
  popUp(template: TemplateRef<HTMLElement>) {
    this.modalRef = this.modalService.show(template);
  }
  /** Method to decline the popUp. */
  decline() {
    this.modalRef.hide();
  }
  /** Method to confirm cancellation of the form. */
  confirmCancel() {
    this.modalRef.hide();
    this.onCancel.emit();
  }

  resetForm() {
    // this is to reload the current route.
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  selectMinorType(type: string, i: number) {
    this.minorsType.at(i).get('english').setValue(type);
  }

  getAge(birthDate) {
    return moment(new Date()).diff(moment(birthDate), 'years');
  }

  getMinorTypeList(minor) {
    if (this.getAge(minor.dateOfBirth.gregorian) > 17) {
      return new LovList([{ value: { english: 'Mentally Minor', arabic: 'قاصر عقلًا' }, sequence: 1 }]);
    } else {
      return new LovList([
        { value: { english: 'Age Minor', arabic: 'قاصر سنّا' }, sequence: 1 },
        { value: { english: 'Mentally Minor', arabic: 'قاصر عقلًا' }, sequence: 2 }
      ]);
    }
  }

  /**
   * Calculate age
   */
  calculatePersonAge(minor) {
    if (minor.dateOfBirth) {
      const birthDate = minor.dateOfBirth.gregorian;
      this.age = this.getAge(birthDate);

      if (birthDate != null) {
        this.dateOfBirth.english =
          convertToStringDDMMYYYY(birthDate.toString()) + ' ' + '(Age: ' + this.age + ' ' + 'years)';
        this.dateOfBirth.arabic =
          convertToStringDDMMYYYY(birthDate.toString()) +
          ' ' +
          '(السن: ' +
          this.age +
          ' ' +
          this.calculateYear(this.age) +
          ')';
      }
      if (this.lang === 'ar') return this.dateOfBirth.arabic;
      else if (this.lang === 'en') return this.dateOfBirth.english;
    }
  }

  /**
   *
   * @param years Label for years
   * @param years
   */
  calculateYear(years) {
    if (years <= 10) {
      return 'سنوات';
    } else if (years > 10) {
      return 'سنة';
    }
  }
}
