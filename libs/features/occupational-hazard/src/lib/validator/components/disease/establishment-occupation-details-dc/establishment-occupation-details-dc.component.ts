/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Disease, DiseaseOccupationDetails, DiseaseWrapper, OccupationDetails, RouteConstants } from '@gosi-ui/features/occupational-hazard/lib/shared';


@Component({
  selector: 'oh-vltr-establishment-occupation-details-dc',
  templateUrl: './establishment-occupation-details-dc.component.html',
  styleUrls: ['./establishment-occupation-details-dc.component.scss']
})
export class EstablishmentOccupationDetailsDcComponent implements OnInit, OnChanges {
  
  maxDate: Date;
  occupationDetails : OccupationDetails[] = [];
  occupationDetailsByManual : OccupationDetails[] = [];

  @Input() diseaseDetails: Disease = new Disease();
  @Input() diseaseDetailsWrapper: DiseaseWrapper = new DiseaseWrapper();
  @Input() canEdit = true;

  @Output() onEdit: EventEmitter<null> = new EventEmitter();
  engagmentlist = [];

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
            this.engagmentlist.push(item.establishmentName.english);
          }
        });
      }else{
        if(occupation.occupation.arabic === null){
          occupation.occupation.arabic = occupation.occupation.english;
        }
      }
      if(occupation.occupation.english !== null){
        occupation.diseaseOccupationDetails.forEach(item => {
          if(item.establishmentName.english !== null){
            this.engagmentlist.push(item.establishmentName.english);
          }
          else{
            this.engagmentlist.push(item.establishmentName.arabic);
          }
        });
      }
     });
          
   }
   this.occupationDetails.forEach(occupation => {
    if(occupation.isManual){
      this.occupationDetailsByManual.push(occupation);   
      console.log(this.occupationDetailsByManual);
                   
    }
   });
   this.occupationDetails = this.occupationDetails.filter(item => item.isManual !== true);
  }
  navigateTo(engagement : DiseaseOccupationDetails) {   
    this.router.navigate([RouteConstants.EST_PROFILE_ROUTE(engagement.registrationNo)]);
    //const url = '/establishment-private/#' + RouteConstants.EST_PROFILE_ROUTE(engagement.registrationNo);
   // window.open(url, '_blank');
  }
   // Method to emit edit details

   onEditOccupationDetails() {
    this.onEdit.emit();
  }
  onDeleteField() {}
}

