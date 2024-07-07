import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RescheduleSessionData } from '../../shared/models';

@Component({
  selector: 'mb-tracking-e-sign-details-dc',
  templateUrl: './tracking-e-sign-details-dc.component.html',
  styleUrls: ['./tracking-e-sign-details-dc.component.scss']
})
export class TrackingESignDetailsDcComponent implements OnInit, OnChanges {
  @Input() sessionData: RescheduleSessionData;
  @Input() lang: string;
  @Input() isContractDoctor = false;
  /**
   * Local variables
   */
  startTime: number;
  endTime: number;
  startMinute: number;
  endMinute: number;
  sessionStartArray = new Array<string>();
  sessionEndArray = new Array<string>();
  constructor() {}
  /**
   * Method to detect changes in input property
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sessionData && changes.sessionData.currentValue) {
      this.sessionData = changes.sessionData.currentValue;
    }
    if (changes.lang && changes.lang.currentValue) {
      this.lang = changes.lang.currentValue;
    }
  }

  ngOnInit(): void {}
}

