import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, AppConstants, BaseComponent, Establishment, StorageService } from '@gosi-ui/core';

//TODO WorkAround till login
@Component({
  selector: 'est-search-establishment-dc',
  templateUrl: './search-establishment-dc.component.html',
  styleUrls: ['./search-establishment-dc.component.scss']
})
export class SearchEstablishmentDcComponent extends BaseComponent implements OnInit {
  /**
   * Output Variables
   */
  tempForm: FormGroup;
  @Output() estSuccess: EventEmitter<null> = new EventEmitter();
  registrationNumber = new FormControl(null, Validators.required);

  // TODO Add method comments
  //FIXME Dont use services in dc components remove them
  constructor(
    readonly alertService: AlertService,
    readonly http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    readonly fb: FormBuilder
  ) {
    super();
  }

  // TODO Add method comments
  ngOnInit() {}

  // TODO Add method comments
  searchEstablishment() {
    this.alertService.clearAlerts();
    if (this.registrationNumber.valid) {
      const getEstablishmentUrl = `/api/v1/establishment/${this.registrationNumber.value}`;
      this.http.get<Establishment>(getEstablishmentUrl).subscribe(
        res => {
          if (res) {
            this.storageService.setSessionValue(AppConstants.ESTABLISHMENT_REG_KEY, this.registrationNumber.value);
            this.router.navigate(['home/contributor/search']);
          }
        },
        err => {
          this.alertService.showError(err.error.message);
        }
      );
    } else {
      this.alertService.showMandatoryErrorMessage();
    }
  }
}
