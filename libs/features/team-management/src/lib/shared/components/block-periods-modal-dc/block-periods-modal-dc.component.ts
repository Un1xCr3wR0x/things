/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BlockPeriodModalTypeEnum } from '../../enums';
import { BlockPeriod } from '../../models';
import { DatePipe } from '@angular/common';
import { LanguageToken, markFormGroupUntouched } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'tm-block-periods-modal-dc',
  templateUrl: './block-periods-modal-dc.component.html',
  styleUrls: ['./block-periods-modal-dc.component.scss']
})
export class BlockPeriodsModalDcComponent implements OnInit {
  lang = 'en';
  /**
   * input variables
   */
  @Input() modalHeader;
  @Input() modalType: string;
  @Input() blockPeriod = null;
  @Input() form: FormGroup;

  /** Output variables */
  @Output() closeModal: EventEmitter<null> = new EventEmitter();
  @Output() confirm: EventEmitter<null> = new EventEmitter();
  /**
   * local variables
   */
  type = BlockPeriodModalTypeEnum;
  minDate = new Date();
  /**
   *
   * @param fb
   * @param datePipe
   */
  constructor(readonly fb: FormBuilder, readonly datePipe: DatePipe,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,) {}
  /**
   * method to initialise tasks
   */
  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
    if (this.blockPeriod) {
      this.bindToForm(this.blockPeriod, this.form);
    }
    markFormGroupUntouched(this.form);
    this.form.updateValueAndValidity();
  }
  /**
   * method to initialise form group
   * @param blockPeriod
   * @param form
   */
  bindToForm(blockPeriod: BlockPeriod, form: FormGroup) {
    Object.keys(blockPeriod).forEach(name => {
      if (form && form.get(name) && blockPeriod[name]) {
        if ((name === 'startDate' || name === 'endDate') && this.lang === 'en') {
         form.get(name).patchValue(this.datePipe.transform(blockPeriod[name], 'dd/MM/yyyy'));
        //  form.get(name).patchValue(blockPeriod[name]);
        } else {
          form.get(name).patchValue(blockPeriod[name]);
        }
        form.updateValueAndValidity();
      }
    });
  }
  /**
   * method to emit confirm
   */
  confirmSubmit() {
    this.confirm.emit();
  }

  /** Method to close the modal. */
  closeBlockModal() {
    this.closeModal.emit();
  }
}
