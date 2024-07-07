import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SubmittedCheckList } from '../../models';

@Component({
  selector: 'est-safety-check-violations-list-dc',
  templateUrl: './safety-check-violations-list-dc.component.html',
  styleUrls: ['./safety-check-violations-list-dc.component.scss']
})
export class SafetyCheckViolationsListDcComponent implements OnInit, OnChanges {
  @Input() violationData: SubmittedCheckList;
  filteredViolationData: SubmittedCheckList;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.violationData && changes?.violationData?.currentValue) {
      this.violationData = changes.violationData?.currentValue;
      this.filteredViolationData = this.filterViolationData(JSON.parse(JSON.stringify(this.violationData)));
    }
  }
  filterViolationData(violationData: SubmittedCheckList): SubmittedCheckList {
    violationData.establishmentSafetyViolations = violationData?.establishmentSafetyViolations?.filter(
      violation => violation?.shownInReport === true
    );
    return violationData;
  }

  ngOnInit(): void {}
}
