import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Disease } from '../../models';
import { BilingualText } from '@gosi-ui/core';
import { OhService } from '../../services';

@Component({
  selector: 'oh-close-disease-dc',
  templateUrl: './close-disease-dc.component.html',
  styleUrls: ['./close-disease-dc.component.scss']
})
export class CloseDiseaseDcComponent implements OnInit {

  @Input() diseaseDetails: Disease;
  @Input() canEdit = false;
  @Input() diseaseClosingStatus: BilingualText;

  @Output() onEdit: EventEmitter<null> = new EventEmitter();

 


  constructor(readonly ohService: OhService) {}

  ngOnInit(): void {
    if(this.diseaseClosingStatus===undefined){
      this.diseaseClosingStatus = this.diseaseDetails?.diseaseStatus;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.diseaseDetails) {
      this.diseaseDetails = changes.diseaseDetails?.currentValue;
      if(this.diseaseClosingStatus===undefined){
        this.diseaseClosingStatus = this.diseaseDetails?.diseaseStatus;
      }
    }
    if (changes && changes.canEdit) {
      this.canEdit = changes.canEdit.currentValue;
    }
  }

  navigateToClose(){
    this.onEdit.emit()

  }

}
