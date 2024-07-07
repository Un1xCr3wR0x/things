/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BranchList, Establishment, EstablishmentService } from '../../../shared';
import { AlertService, ApplicationTypeEnum, ApplicationTypeToken, AuthTokenService, Lov, LovList } from '@gosi-ui/core';

@Component({
  selector: 'est-link-establishment-dc',
  templateUrl: './link-establishment-dc.component.html',
  styleUrls: ['./link-establishment-dc.component.scss']
})
export class LinkEstablishmentDcComponent implements OnChanges, OnInit {
  /**
   * Local Variables
   */
  registrationNo = new FormControl('', Validators.required);
  formGroup: FormGroup;
  mainBranchList: LovList;
  isAppPrivate: boolean;
  regNo: number;
  showReset: boolean;

  /**
   * Input variables
   */
  @Input() establishment: Establishment;
  @Input() itemsPerPage = 10;
  @Input() pageDetails = {
    currentPage: 1,
    goToPage: 1
  };
  @Input() currentPage = 1;
  @Input() establishments: BranchList[] = [];
  @Input() totalBranches: number;
  @Input() selectedBranchesRegNo: number[] = [];
  @Input() paginationId = 'establishmentBranchList';
  @Input() newMainEstablishmentRegNo: number;

  /**
   * Output Variables
   */
  @Output() search: EventEmitter<FormControl> = new EventEmitter();
  @Output() selectedEstablishment: EventEmitter<BranchList> = new EventEmitter();
  @Output() pageIndexEvent: EventEmitter<number> = new EventEmitter();
  @Output() reset: EventEmitter<void> = new EventEmitter();

  constructor(
    readonly establishmentService: EstablishmentService,
    readonly authService: AuthTokenService,
    @Inject(ApplicationTypeToken) readonly appToken: string,
    readonly fb: FormBuilder,
    readonly alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.isAppPrivate = this.appToken === ApplicationTypeEnum.PRIVATE;
    this.regNo = this.establishmentService.registrationNo;
    this.formGroup = this.fb.group({
      english: null,
      arabic: null
    });
    this.formGroup.setValidators(Validators.required);
    this.formGroup.updateValueAndValidity();
    if (!this.isAppPrivate) {
      const token = this.authService.decodeToken(this.authService.getAuthToken());
      this.establishmentService.getEstablishmentGroupsUnderAdmin(Number(token.uid)).subscribe(value => {
        let list: Lov[] = [];
        value.branchList.map(value1 => {
          if (value1.registrationNo !== this.regNo) {
            list.push({
              value: { arabic: String(value1.registrationNo), english: String(value1.registrationNo) },
              sequence: value1.registrationNo
            });
          }
        });
        this.mainBranchList = new LovList(list);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.newMainEstablishmentRegNo && changes.newMainEstablishmentRegNo.currentValue) {
      this.registrationNo.setValue(changes.newMainEstablishmentRegNo.currentValue);
      this.showReset = changes?.newMainEstablishmentRegNo?.currentValue !== undefined;
    }
  }

  onSearch() {
    this.registrationNo.markAllAsTouched();
    if (this.registrationNo && this.registrationNo.valid) {
      this.search.emit(this.registrationNo);
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
  selectedPage(page: number): void {
    this.pageIndexEvent.emit(page);
  }

  resetForm() {
    this.reset.emit();
    this.registrationNo.reset();
    this.registrationNo.enable();
    this.formGroup.reset();
    this.formGroup.enable();
    this.showReset = false;
    this.formGroup.setValidators(Validators.required);
    this.formGroup.updateValueAndValidity();
  }

  selectEventTest(event) {
    this.formGroup.get('english').patchValue(event);
    this.formGroup.get('arabic').patchValue(event);
    this.formGroup.disable();
    this.showReset = true;
    this.registrationNo.setValue(event);
    this.onSearch();
  }
}
