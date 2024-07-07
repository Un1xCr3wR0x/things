import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BilingualText } from '@gosi-ui/core';
import { Disease, HealthInspection } from '@gosi-ui/features/occupational-hazard/lib/shared';

@Component({
  selector: 'oh-health-inspection-details-dc',
  templateUrl: './health-inspection-details-dc.component.html',
  styleUrls: ['./health-inspection-details-dc.component.scss']
})
export class HealthInspectionDetailsDcComponent implements OnInit, OnChanges {
  
  @Input() parentForm: FormGroup;
  @Input() healthInspectionDetails: HealthInspection;
  @Input() diseaseDetails: Disease = new Disease();

  inspectionDetails: HealthInspection;
  estNames: BilingualText = new BilingualText();
  estEngArray: string[] = [];
  estArabArray: string[] = [];

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.diseaseDetails && changes.diseaseDetails.currentValue){
      this.diseaseDetails = changes.diseaseDetails.currentValue;
      this.diseaseDetails.establishmentName.forEach(element => {
        this.estArabArray.push(element.arabic);
        // this.estEngArray.push(element.english);
      });
      this.estNames.arabic=this.estArabArray.join(' , ');
      // this.estNames.english=this.estEngArray.join(', ');
    }
  }
}
