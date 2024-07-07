/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { checkBilingualTextNull, GosiCalendar, NationalityTypeEnum, Person } from '@gosi-ui/core';
import { EstablishmentConstants } from '../../../../shared';

@Component({
  selector: 'est-owner-details-dc',
  templateUrl: './owner-details-dc.component.html',
  styleUrls: ['./owner-details-dc.component.scss']
})
export class OwnerDetailsDcComponent implements OnInit, OnChanges, AfterContentInit {
  /* Input Variables*/
  @Input() person: Person = new Person();
  @Input() showDate = false;
  @Input() startDate: GosiCalendar = new GosiCalendar();
  @Input() endDate: GosiCalendar = new GosiCalendar();
  @Input() index: number;
  @Input() canEdit = true;
  @Input() showHeading = true;
  @Input() isGcc = false;
  @Input() heading = 'ESTABLISHMENT.OWNER';
  @Input() showAddress = true;
  name = '';

  //Output variable
  @Output() onEdit: EventEmitter<null> = new EventEmitter();

  /* Local Variables*/
  saudiNationality = false;
  gccNationality = false;
  others = false;

  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes.person) {
      this.person = changes.person.currentValue;
      this.getOwnerName();
    }
  }

  ngOnInit() {}

  /**
   * This method is to check if the data is null or not
   * @param control
   */
  checkNull(control) {
    return checkBilingualTextNull(control);
  }

  ngAfterContentInit() {
    this.getIdentifierType();
  }

  // this method is used to match the identifier corresponding to nationality
  getIdentifierType() {
    if (this.person && this.person.nationality) {
      if (this.person.nationality.english === NationalityTypeEnum.SAUDI_NATIONAL) {
        this.saudiNationality = true;
      } else if (EstablishmentConstants.GCC_NATIONAL.indexOf(this.person.nationality.english) !== -1) {
        this.gccNationality = true;
      } else {
        this.others = true;
      }
    }
  }

  getOwnerName() {
    if (this.person) {
      if (this.person.name && this.person.name.arabic) {
        if (this.person.name.arabic.firstName) {
          this.name =
            this.person.name.arabic.firstName +
            ' ' +
            this.orEmpty(this.person.name.arabic.secondName) +
            ' ' +
            this.orEmpty(this.person.name.arabic.thirdName) +
            ' ' +
            this.orEmpty(this.person.name.arabic.familyName);
        }
      }
    }
  }

  /**
   * This method is used to return entity value if not null else empty value
   */
  orEmpty = function (entity) {
    return entity || '';
  };

  //This Method is to get prefix for the corresponsing isd code
  getISDCodePrefix() {
    let prefix = '';
    Object.keys(EstablishmentConstants.ISD_PREFIX_MAPPING).forEach(key => {
      if (key === this.person.contactDetail.mobileNo.isdCodePrimary) {
        prefix = EstablishmentConstants.ISD_PREFIX_MAPPING[key];
      }
    });
    return prefix;
  }
  // method to emit edit values
  onEditOwnerDetails() {
    this.onEdit.emit();
  }
}
