import { Component, Input, OnInit } from '@angular/core';
import { AssessmentDetail } from '../../models';

@Component({
  selector: 'mb-conveyance-details-dc',
  templateUrl: './conveyance-details-dc.component.html',
  styleUrls: ['./conveyance-details-dc.component.scss']
})
export class ConveyanceDetailsDcComponent implements OnInit {
  @Input() assessmentDetails: AssessmentDetail;
  @Input() isValidatorView = true;
  @Input() isAmb;

  address: string;
  geoCoder: google.maps.Geocoder;
  originLongitude: string;
  originLatitude: string;

  constructor() { }

  ngOnInit(): void {
    if (this.assessmentDetails) {
      this.originLongitude = this.assessmentDetails?.originLongitude || '46.6752957';
      this.originLatitude = this.assessmentDetails?.originLatitude || '24.7135517';
    }
    this.getPlaceByLocation();
  }
  getPlaceByLocation() {
    this.geoCoder = new google.maps.Geocoder();
    this.geoCoder.geocode(
      { location: { lat: Number(this.originLatitude), lng: Number(this.originLongitude) } },
      results => {
        this.address = results[5].formatted_address;
      }
    );
  }
}
