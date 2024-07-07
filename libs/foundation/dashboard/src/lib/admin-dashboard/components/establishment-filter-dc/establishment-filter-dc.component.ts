import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BilingualText, LanguageToken, LovList } from '@gosi-ui/core';
import { FilterDcComponent } from '@gosi-ui/foundation-theme/src';
import { BehaviorSubject } from 'rxjs';
import { RequestFilter, SearchRequest } from '@gosi-ui/foundation-dashboard';

@Component({
  selector: 'dsb-establishment-filter-dc',
  templateUrl: './establishment-filter-dc.component.html',
  styleUrls: ['./establishment-filter-dc.component.scss']
})
export class EstablishmentFilterDcComponent implements OnInit, OnChanges {
  //Local Variables
  locationFilterForm: FormGroup = new FormGroup({});
  selectedlocationOptions: BilingualText[] = [];
  locationValue: BilingualText[];
  estFieldOfficeList: LovList;
  lang = 'en';
  estFilter: RequestFilter = new RequestFilter();
  @ViewChild('filterComponent', { static: false })
  filterComponent: FilterDcComponent;
  //Output Variables
  @Input() villageLocationList: LovList;
  @Input() searchRequest: SearchRequest = new SearchRequest();
  //Output Variables
  @Output() filter: EventEmitter<RequestFilter> = new EventEmitter();
  constructor(private fb: FormBuilder, @Inject(LanguageToken) readonly language: BehaviorSubject<string>) {}

  ngOnInit(): void {
    this.language.subscribe(lang => (this.lang = lang));
    this.locationFilterForm = this.createForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.villageLocationList?.currentValue)
      this.villageLocationList = changes?.villageLocationList?.currentValue;
  }
  /**
   * Method to clear filter
   */
  clearAllFilters(): void {
    this.locationFilterForm.get('location').reset();
    this.selectedlocationOptions = [];
    this.defaultFilter();
    this.filter.emit(this.estFilter);
  }
  /**
   * This method is to clear the field office values
   */
  setLocationClear() {
    this.selectedlocationOptions = null;
    this.estFilter.village = [];
    this.estFilter.villageId = [];
    this.locationFilterForm.get('location').reset();
  }

  /**
   * Method for apply filter options
   */
  applyFilter(): void {
    if (this.selectedlocationOptions && this.selectedlocationOptions.length >= 1) {
      this.locationValue = this.selectedlocationOptions;
    } else {
      this.locationValue = null;
    }

    this.estFilter.village = this.locationValue;

    this.onFilter();
  }
  createForm() {
    return this.fb.group({
      location: this.fb.group({
        english: [null],
        arabic: [null]
      })
    });
  }
  defaultFilter(): void {
    this.estFilter.village = [];
    this.estFilter.villageId = [];
  }
  private onFilter(): void {
    this.filter.emit(this.estFilter);
  }

  setValues(): void {
    if (this.searchRequest) {
      if (this.searchRequest.filter && this.searchRequest.filter.village) {
        this.selectedlocationOptions = this.searchRequest.filter.village;
      }
    }
  }
  onVillageSelection(village: BilingualText[]) {
    this.selectedlocationOptions = village;
    if (this.villageLocationList)
      this.estFilter.villageId = this.villageLocationList.items
        .filter(item => (village.find(villageItem => villageItem.english === item.value.english) ? true : false))
        .map(item => item.code);
  }
}
