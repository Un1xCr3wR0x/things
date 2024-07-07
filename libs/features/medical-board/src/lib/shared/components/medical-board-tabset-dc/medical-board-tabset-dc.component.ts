import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { SessionStatusDetails } from '../../models';

@Component({
  selector: 'mb-medical-board-tabset-dc',
  templateUrl: './medical-board-tabset-dc.component.html',
  styleUrls: ['./medical-board-tabset-dc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  
})
export class MedicalBoardTabsetDcComponent implements OnInit, OnChanges {
  constructor(private cdr: ChangeDetectorRef) {}

  /* Input Variables */
  @Input() medicalTab: string;
  @Input() count: number;
  @Input() medicalTabItems = [];
  @Input() isSession: boolean;
  @Input() sessionStatusDetails: SessionStatusDetails = new SessionStatusDetails();
  /* Output Variables */
  @Output() tabSelected: EventEmitter<string> = new EventEmitter();
  ngOnInit() {}
  /* Method to fetch data on input changes*/
  ngOnChanges(changes: SimpleChanges) {    
    if (changes && changes?.medicalTabItems) {
      this.medicalTabItems = changes.medicalTabItems.currentValue;
    }
    if (changes && changes?.sessionStatusDetails) {
      this.sessionStatusDetails = changes.sessionStatusDetails.currentValue;
    }
    if (changes?.medicalTab?.currentValue) {
      this.medicalTab = changes.medicalTab.currentValue;
    }
  }

  /* Method to active tab on clicking*/
  activeBillTab(tabSelected: string) {
    this.tabSelected.emit(tabSelected);
  }
}
