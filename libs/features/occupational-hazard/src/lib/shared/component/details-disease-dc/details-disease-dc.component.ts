import { Component, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Disease } from '../../models';

@Component({
  selector: 'oh-details-disease-dc',
  templateUrl: './details-disease-dc.component.html',
  styleUrls: ['./details-disease-dc.component.scss']
})
export class DetailsDiseaseDcComponent implements OnChanges {

    /**
   * Input variables
   */
    @Input() disease: Disease;
    @Output() diseaseSelected: EventEmitter<number> = new EventEmitter();
  
    /**
     *Method to detect changes in input
     * @param changes Capturing input on changes
     */
    ngOnChanges(changes: SimpleChanges) {
  
    }
    /**
     * Method to emit the selected disease id
     * @param diseaseId
     */
    viewDiseaseId(diseaseId: number) {
      this.diseaseSelected.emit(diseaseId);
    }
  }
  