/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { BorderNumber, IdentityTypeEnum, Iqama, NationalId, NIN, Passport } from '@gosi-ui/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AnnuityResponseDto, DependentDetails, DependentHistory, HeirBenefitDetails } from '../../models';

@Component({
  selector: 'bnt-validator-heir-benefits-details-dc',
  templateUrl: './validator-heir-benefits-details-dc.component.html',
  styleUrls: ['./validator-heir-benefits-details-dc.component.scss']
})
export class ValidatorHeirBenefitsDetailsDcComponent implements OnInit {
  modalRef: BsModalRef;
  @Input() lang = 'en';
  @Input() heirOrDependentDetails: DependentDetails[];
  @Input() heirBenefitDetails: HeirBenefitDetails[];
  @Input() annuityBenefitDetails: AnnuityResponseDto;
  @Input() dependentHistory: DependentHistory;
  @Output() getHeirHistory: EventEmitter<number> = new EventEmitter();

  constructor(readonly modalService: BsModalService) {}

  ngOnInit(): void {}
  getIdentifierLabelOrValue(retrunType: string, value: NIN | Iqama | NationalId | Passport | BorderNumber) {
    if (value) {
      switch (value.idType) {
        case IdentityTypeEnum.NIN:
          return retrunType === 'label' ? 'BENEFITS.NATIONAL-ID' : value['newNin'];
        case IdentityTypeEnum.PASSPORT:
          return retrunType === 'label' ? 'BENEFITS.PASSPORT-NO' : value['passportNo'];
        case IdentityTypeEnum.IQAMA:
          return retrunType === 'label' ? 'BENEFITS.IQAMA-NUMBER' : value['iqamaNo'];
        case IdentityTypeEnum.BORDER:
          return retrunType === 'label' ? 'BENEFITS.BORDER-NO' : value['id'];
        // case IdentityTypeEnum.GCCID:
        //   return retrunType === 'label' ? 'BENEFITS.GCC-NIN' : value['id'];

        default:
          return '';
      }
    } else {
      return '';
    }
  }
  showModal(templateRef: TemplateRef<HTMLElement>, personId: number) {
    this.getHeirHistory.emit(personId);
    this.modalRef = this.modalService.show(templateRef, Object.assign({}, { class: 'modal-xl' }));
  }
  closeModal() {
    this.modalService.hide();
  }
}
