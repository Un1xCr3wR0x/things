/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { Component, EventEmitter, Inject, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { AlertService, BaseComponent, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'oh-contributor-search-dc',
  templateUrl: './contributor-search-dc.component.html',
  styleUrls: ['./contributor-search-dc.component.scss']
})
export class ContributorSearchDcComponent extends BaseComponent implements OnInit, OnChanges {
  /**
   * Local Variables
   */
  lang = 'en';
  searchContributorForm = new FormControl(null, {
    validators: Validators.required
  });
  @Input() parentForm: FormGroup;
  @Input() isGroupInjuryScreen = false;
  /**
   * Output variables
   */
  @Output() next: EventEmitter<null> = new EventEmitter();

  /**
   * This method is used to initialise the component*
   */
  constructor(readonly alertService: AlertService, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {
    super();
  }

  /**
   * This method handles the initialization tasks.
   *
   * @memberof InjurySearchDcComponent
   */ 
  ngOnInit() {
    this.language.subscribe(language => (this.lang = language));
    if (this.parentForm) {
      this.parentForm.addControl('searchContributor', this.searchContributorForm);
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.isGroupInjuryScreen && changes.isGroupInjuryScreen.currentValue){
      this.isGroupInjuryScreen = changes.isGroupInjuryScreen.currentValue;
    }
  }

  /**
   * Saerching the contributor after validation on keypress and search click
   */
  searchContributor() {
    if (this.searchContributorForm.valid) {
      this.next.emit(this.searchContributorForm.value);
    } else {
      this.alertService.clearAlerts();
      this.alertService.showMandatoryErrorMessage();
    }
  }
}

