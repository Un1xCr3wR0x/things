import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DiseaseOccupationDetails, DiseaseWrapper } from '../../models';
import { Disease } from '../../models/disease-details';
import { OccupationDetails } from '../../models/occupation';
import { RouteConstants } from '../../constants';

@Component({
  selector: 'oh-establishment-occupation-details-dc',
  templateUrl: './establishment-occupation-details-dc.component.html',
  styleUrls: ['./establishment-occupation-details-dc.component.scss']
})
export class EstablishmentOccupationDetailsDcComponent implements OnInit, OnChanges {

  maxDate: Date;
  occupationDetails : OccupationDetails[] = [];
  occupationDetailsByManual : OccupationDetails[] = [];

  @Input() diseaseDetails: Disease = new Disease();
  @Input() diseaseDetailsWrapper: DiseaseWrapper = new DiseaseWrapper();

  constructor(readonly router: Router) {}

  ngOnInit(): void {
    this.maxDate = new Date();
  }
  ngOnChanges(changes: SimpleChanges): void {
      if(changes.diseaseDetails && changes.diseaseDetails.currentValue){
     this.diseaseDetails = changes.diseaseDetails.currentValue;
     this.occupationDetails = this.diseaseDetailsWrapper.diseaseOccupationDurationDto;
     let index= 1;
     this.occupationDetails.forEach(occupation => {
      occupation.occupationId = index;
      index++;
      if(occupation.occupation.english === null){
        occupation.occupation.english = occupation.occupation.arabic;
        occupation.diseaseOccupationDetails.forEach(item => {
          if(item.establishmentName.english === null){
            item.establishmentName.english = item.establishmentName.arabic;
          }
        });
      }else{
        if(occupation.occupation.arabic === null){
          occupation.occupation.arabic = occupation.occupation.english;
        }
      }
     });
   }
   this.occupationDetails.forEach(occupation => {
    if(occupation.isManual){
      this.occupationDetailsByManual.push(occupation);                
    }
   });
   this.occupationDetails = this.occupationDetails.filter(item => item.isManual !== true);
  }
  navigateTo(engagement : DiseaseOccupationDetails) {   
    this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(engagement.registrationNo)]);
   /*  const url = '#' + `/home/establishment/profile/${engagement.registrationNo}/view`;
    window.open(url, '_blank'); */
  }
  onDeleteField() {}

}
