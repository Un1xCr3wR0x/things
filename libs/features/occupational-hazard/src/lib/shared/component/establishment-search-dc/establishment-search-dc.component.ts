import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { OhService } from '../../services';

@Component({
  selector: 'oh-establishment-search-dc',
  templateUrl: './establishment-search-dc.component.html',
  styleUrls: ['./establishment-search-dc.component.scss']
})
export class EstablishmentSearchDcComponent implements OnInit {

  /**
   * Local Variables
   */
  lang = 'en';
  searchEstablishmentForm = new FormControl(null, {
    validators: Validators.required
  });
  @Input() parentForm: FormGroup;

  /**
   * Output variables
   */
  @Output() next: EventEmitter<null> = new EventEmitter();
  @Output() keyUp: EventEmitter<string> = new EventEmitter();


  /**
   * This method is used to initialise the component*
   */

  constructor(readonly alertService: AlertService, readonly ohService: OhService, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {

   }

  ngOnInit() {
    this.language.subscribe(language => (this.lang = language));
    if (this.parentForm) {
      this.parentForm.addControl('searchEstablishment', this.searchEstablishmentForm);
    }
  }

  /**
   * Saerching the establishment after validation on keypress and search click
   */
  searchEstablishment() {
    this.ohService.setNewRegistrationNumber(this.searchEstablishmentForm.value);
    if (this.searchEstablishmentForm.valid) {
      this.next.emit(this.searchEstablishmentForm.value);
    } else {
      this.alertService.clearAlerts();
      this.alertService.showMandatoryErrorMessage();
    }
  }
  onKeyUp(searchTerm) {
    this.keyUp.emit(searchTerm);
  }
}

