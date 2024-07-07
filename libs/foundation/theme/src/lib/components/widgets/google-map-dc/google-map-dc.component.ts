/// <reference types="@types/googlemaps" />
/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, Input, NgZone, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent, GoogleMapDetails, Lov, LovList, NationalityTypeEnum } from '@gosi-ui/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'gosi-google-map-dc',
  templateUrl: './google-map-dc.component.html',
  styleUrls: ['./google-map-dc.component.scss']
})
export class GoogleMapDcComponent extends BaseComponent implements OnInit, OnChanges {
  /**
   * Input variables
   */
  @Input() city: string = null;

  @Input() showCountry = false;
  @Input() parentForm: FormGroup;

  /**
   * Lookups
   */
  @Input() cityList: LovList = new LovList([]);
  @Input() countryList: LovList = new LovList([]);
  @Input() showCity = true;
  @Input() latitude = 24.894801;
  @Input() longitude = 46.610461;
  @Input() mapViewMode = false;
  @Input() showCityDistrict = false;
  @Input() readOnlyAll = false;
  @Input() cityDistrictList: LovList = null;
  @Input() showMarker = false;
  @Input() showMap = true;

  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;

  /**
   * Local variables
   */

  riyadhLatitude = 24.894801;
  riyadhLongitude = 46.610461;
  centerValue: string;

  selectedCountry: string = NationalityTypeEnum.SAUDI_NATIONAL;

  geoCoder: google.maps.Geocoder;
  position = { lat: null, lng: null };

  placeForm: FormGroup;
  googleMap: GoogleMapDetails = new GoogleMapDetails();
  center: google.maps.LatLngLiteral = { lat: this.riyadhLatitude, lng: this.riyadhLongitude };
  zoom = 12;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  mapOptions: google.maps.MapOptions = {
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: 'greedy'
  };
  /**
   *
   * @param maps
   * @param ngZone
   */
  constructor(readonly ngZone: NgZone, readonly fb: FormBuilder) {
    super();
  }

  /**
   *
   */
  ngOnInit() {
    //this.setCurrentLocation();

    this.placeForm = this.createPlaceForm();
    if (this.parentForm) {
      this.parentForm.addControl('placeForm', this.placeForm);
      if (this.placeForm) {
        const city = this.placeForm.get('city').get('english');
        if (this.showCity === false) {
          city.clearValidators();
        }
      }
    }

    this.geoCoder = new google.maps.Geocoder();

    this.placeForm.get('country').valueChanges.subscribe(() => {
      this.setZoom();
    });
    this.placeForm.get('city').valueChanges.subscribe(() => {
      this.setZoom();
    });

    this.setCurrentLocation();
  }

  /**
   * on changes creating the parent form for adding validation.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.showCityDistrict) {
      this.showCityDistrict = changes.showCityDistrict.currentValue;
    }
    if (changes && changes.latitude) {
      this.latitude = changes.latitude.currentValue;
      this.showMarker = true;
    }
    if (changes && changes.longitude) {
      this.longitude = changes.longitude.currentValue;
      this.showMarker = true;
    }
    if (changes && changes.showCity) {
      this.showCity = changes.showCity.currentValue;
    }
    if (changes && changes.cityDistrictList) {
      this.cityDistrictList = changes.cityDistrictList.currentValue;
    }
    if (this.parentForm && this.placeForm) {
      this.parentForm.addControl('placeForm', this.placeForm);
      if (this.placeForm) {
        const city = this.placeForm.get('city').get('english');
        if (this.showCity === false) {
          city.clearValidators();
        }
      }
    }
    this.setZoom();
    if (this.mapViewMode) {
      this.showMarker = true;
      this.zoom = 11;
      this.center = { lat: this.latitude, lng: this.longitude };
      /* this.centerValue = this.latitude.toString()+", "+this.longitude.toString();
       */
    }
    if (this.latitude && this.longitude) {
      this.zoom = 11;
      this.center = { lat: this.latitude, lng: this.longitude };
      this.showMarker = true;
    }
  }
  /**
   * form for selecting city for google map
   */
  createPlaceForm() {
    return this.fb.group({
      country: this.fb.group({
        english: [NationalityTypeEnum.SAUDI_NATIONAL, { validators: Validators.required }],
        arabic: [null]
      }),
      city: this.fb.group({
        english: [null, { validators: Validators.required }],
        arabic: [null]
      }),
      cityDistrict: this.fb.group({
        english: [null],
        arabic: [null]
      }),
      latitude: [null],
      longitude: [null]
    });
  }

  /**
   * setting the zoom for map
   */
  setZoom() {
    this.zoom = 15;
  }
  /**
   *
   * @param event to set the selected location.
   */
  onChoseLocation(event: google.maps.MouseEvent) {
    if (!this.mapViewMode) {
      this.showMarker = true;
      this.placeForm.get('latitude').setValue(event.latLng.toJSON().lat);
      this.placeForm.get('longitude').setValue(event.latLng.toJSON().lng);
      this.placeForm.updateValueAndValidity();
      this.latitude = event.latLng.toJSON().lat;
      this.longitude = event.latLng.toJSON().lng;
      this.updateMapCenter(event.latLng.toJSON().lat, event.latLng.toJSON().lng);
    }
  }
  mapValidation() {
    this.showMap = this.selectedCountry === NationalityTypeEnum.SAUDI_NATIONAL ? true : false;
    if (!this.showMap) {
      this.placeForm.get('latitude').clearValidators();
      this.placeForm.get('longitude').clearValidators();
      this.placeForm.get('latitude').setValidators(null);
      this.placeForm.get('longitude').setValidators(null);
      this.placeForm.get('latitude').setValue(null);
      this.placeForm.get('longitude').setValue(null);
    } else {
      this.placeForm.get('latitude').setValidators([Validators.required]);
      this.placeForm.get('longitude').setValidators([Validators.required]);
    }
    this.placeForm.get('latitude').updateValueAndValidity();
    this.placeForm.get('longitude').updateValueAndValidity();
  }

  selectCountry() {
    this.setZoom();
    this.showCityDistrict = false;
    this.selectedCountry = this.selectedCountry != null ? this.selectedCountry : NationalityTypeEnum.SAUDI_NATIONAL;
    this.placeForm.get('city').get('english').setValue(null);
    this.placeForm.get('city').get('arabic').setValue(null);
    this.placeForm.get('cityDistrict').get('english').setValue(null);
    this.placeForm.get('cityDistrict').get('arabic').setValue(null);
    this.selectedCountry = this.placeForm.get('country').get('english').value;
    this.showCity = this.selectedCountry === NationalityTypeEnum.SAUDI_NATIONAL ? true : false;
    const city = this.placeForm.get('city').get('english');
    this.mapValidation();
    if (!this.showCity) {
      city.clearValidators();
      this.placeForm.get('cityDistrict').get('english').clearValidators();
      this.placeForm.get('city').get('english').setValue(null);
      this.placeForm.get('city').get('arabic').setValue(null);
      this.placeForm.get('cityDistrict').get('english').setValue(null);
      this.placeForm.get('cityDistrict').get('arabic').setValue(null);
    } else {
      city.setValidators([Validators.required, Validators.maxLength(50)]);
    }
    city.updateValueAndValidity();
    this.getLocation(this.mapCallBack, this.selectedCountry, null, this);
  }
  /**
   *
   * @param city to get the corresponding city district
   */
  selectCity(city: Lov) {
    if (city === null) {
      this.zoom = 10;
      this.latitude = this.riyadhLatitude;
      this.longitude = this.riyadhLongitude;
      this.updateMapCenter(this.latitude, this.longitude);
      return;
    }

    this.setZoom();
    this.mapValidation();
    if (city != null && city.items != null && city.items.length > 0) {
      this.showCityDistrict = true;
      this.cityDistrictList = new LovList(city.items);
      if (city.items.length === 1) {
        this.showCityDistrict = false;
        this.placeForm.get('cityDistrict').get('english').setValue(city.items[0].value.english);
        this.placeForm.get('cityDistrict').get('arabic').setValue(city.items[0].value.arabic);
      } else {
        this.placeForm
          .get('cityDistrict')
          .get('english')
          .setValidators([Validators.required, Validators.maxLength(50)]);
      }
    } else {
      this.showCityDistrict = false;
      this.placeForm.get('cityDistrict').get('english').setValidators(null);
      this.placeForm.get('cityDistrict').get('english').setValue(null);
    }
    this.placeForm.get('cityDistrict').get('english').updateValueAndValidity();
    this.getLocation(this.mapCallBack, this.selectedCountry, city.value.english, this);
  }

  /**
   * Method to get the current location of the browser
   */
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.riyadhLatitude = position.coords.latitude;
        this.riyadhLongitude = position.coords.longitude;
        this.zoom = 10;
      });
    }
  }

  /**
   *
   * @param mapCallBack
   * @param city
   * @param scope
   */
  getLocation(mapCallBack, country, city, scope) {
    let queryString = {};
    if (city !== null) {
      this.zoom = 10;
      queryString = {
        address: city,
        componentRestrictions: {
          country: 'SA'
        }
      };
    } else {
      scope.zoom = 10;
      queryString = {
        address: country
      };
    }
    this.geoCoder.geocode(queryString, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        scope.zoom = 10;
        mapCallBack(results[0], scope);
        scope.googleMap.latitude = scope.latitude;
        scope.googleMap.longitude = scope.longitude;
        scope.updateMapCenter(scope.googleMap.latitude, scope.googleMap.longitude);
      } else {
        scope.zoom = 10;
        scope.latitude = scope.riyadhLatitude;
        scope.longitude = scope.riyadhLongitude;
        scope.updateMapCenter(scope.latitude, scope.longitude);
      }
    });
  }

  /**
   *
   * @param location
   * @param scope
   */
  mapCallBack(location: google.maps.GeocoderResult, scope) {
    scope.latitude = location.geometry.location.lat();
    scope.longitude = location.geometry.location.lng();
    scope.zoom = 10;
    scope.updateMapCenter(scope.latitude, scope.longitude);
  }

  /**
   *
   */
  updateMapCenter(lat, lng) {
    this.map.panTo(new google.maps.LatLng(lat, lng));
  }

  /**
   * checking the validation for the map where location is there or not,
   * however on clicking on the map the location is saved.
   */
  validateMapArea() {
    return (
      this.placeForm.get('latitude').invalid &&
      this.placeForm.get('latitude').touched &&
      this.placeForm.get('longitude').invalid &&
      this.placeForm.get('longitude').touched
    );
  }
}
