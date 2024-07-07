import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EstablishmentSafetyChecklist, SubmittedCheckList } from '../../models';

@Component({
  selector: 'est-sc-full-checklist-dc',
  templateUrl: './sc-full-checklist-dc.component.html',
  styleUrls: ['./sc-full-checklist-dc.component.scss']
})
export class ScFullChecklistDcComponent implements OnInit, OnChanges {
  @Input() safetyChecklists: EstablishmentSafetyChecklist[];
  @Input() adminSelectedList: SubmittedCheckList;
  accordionPanel = -1;
  valueTypeSingle = 'single';

  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.setDataForDisplay();
  }
  hideModal() {
    if (this.modalRef) this.modalRef.hide();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.safetyChecklists && changes?.safetyChecklists?.currentValue) {
      this.safetyChecklists = changes?.safetyChecklists?.currentValue;
    }
    if (changes?.adminSelectedList && changes?.adminSelectedList?.currentValue) {
      this.adminSelectedList = changes?.adminSelectedList?.currentValue;
      this.setDataForDisplay();
    }
  }
  setDataForDisplay() {
    this.safetyChecklists?.forEach(category => {
      category.selectedCount = 0;
      category?.subCategory.forEach(subCategory => {
        subCategory?.guideLines?.forEach(guideLine => {
          const data = this.adminSelectedList?.establishmentSafetyViolations?.find(
            item => item?.guidelineId === guideLine?.guidelineId
          );
          if (data?.guidelineId && subCategory?.valueType !== this.valueTypeSingle) {
            guideLine.selected = true;
            category.selectedCount++;
            if (guideLine?.additionalInfoList?.length > 0) {
              guideLine?.additionalInfoList?.forEach(addInfo => {
                const info = data?.addictionInfoList.find(item => item?.additionalInfoId === addInfo?.addInfoId);
                if (info?.additionalInfoId) {
                  addInfo.value = info?.additionalInfoValue;
                }
              });
            }
          }
        });
      });
    });
  }
  selectPanel(openEvent: boolean, tabIndex: number) {
    if (openEvent === true) {
      this.accordionPanel = tabIndex;
    }
  }
  showPDF() {
    throw new Error('Method not implemented.');
  }
}
