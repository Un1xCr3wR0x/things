import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Injury } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'oh-transfer-injury-details-dc',
  templateUrl: './transfer-injury-details-dc.component.html',
  styleUrls: ['./transfer-injury-details-dc.component.scss']
})
export class TransferInjuryDetailsDcComponent implements OnInit {
  constructor(readonly router: Router) {}
  /**
   * Input variables
   */
  @Input() injury: Injury;
  @Input() canEdit = true;
  @Input() registrationNo: number;


  /**Output Variables */
  @Output() injurySelected: EventEmitter<Injury> = new EventEmitter();



  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.injury) {
      this.injury = changes.injury.currentValue;
    }
    
  }

  /**
   * This method is to navigate to dashboard
   */
  navigateToDashboard() {
    if (this.registrationNo) this.router.navigate([`home/establishment/profile/${this.registrationNo}/view`]);
    else {
      this.router.navigate(['home/establishment/profile']);
    }
  }

  viewInjuryDetails(injury: Injury) {
    this.injurySelected.emit(injury);
  }
}
