import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'gosi-search-dc',
  templateUrl: './search-dc.component.html',
  styleUrls: ['./search-dc.component.scss']
})
export class SearchDcComponent implements OnInit, OnChanges {
  control: FormControl = new FormControl();
  closeIcon = false;
  private specialKeys: Array<string> = ['Enter'];
  @Input() placeholder: string;
  @Input() parentForm: FormGroup;
  @Input() isLoading = false;
  @Input() allowOnlyNumbers = false;
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Input() searchParam = '';
  @Input() clearSearch: boolean;
  @Input() minimumLength = 2;
  @ViewChild('searchicon') searchbutton: ElementRef;
  constructor() {}

  ngOnInit() {
    if (this.parentForm) {
      if (this.parentForm.get('search')) {
        this.parentForm.removeControl('search');
      }
      this.parentForm.addControl('search', this.control);
      this.parentForm.get('search').setValue(this.searchParam);
      this.control.setValue(this.searchParam);
      if (this.searchParam?.length > 2) {
        this.closeIcon = true;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchParam && changes.searchParam.currentValue) {
      this.searchParam = changes.searchParam.currentValue;
      this.parentForm?.get('search').setValue(this.searchParam);
      this.control?.setValue(this.searchParam);
      if (this.searchParam?.length > 2) {
        this.closeIcon = true;
      }
    }

    if (changes.clearSearch && changes.clearSearch.currentValue) {
        this.resetSearch();
    }
  }

  @HostListener('keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.control?.value?.length > this.minimumLength && this.specialKeys.indexOf(event.key) !== -1) {
      this.closeIcon = true;
      this.searchValue(this.control.value);
    }
  }
  // Method to emit search details
  searchValue(value: string) {
    value = value?.trim() || '';
    if (this.searchParam !== value && !this.isLoading && this.control.value?.length > this.minimumLength) {
      this.closeIcon = true;
      this.searchParam = value;
      this.search.emit(value);
    } else if (value && this.searchParam === value) {
      this.closeIcon = true;
    } else this.closeIcon = false;
  }

  get hasValue() {
    return this.control.value;
  }
  resetSearch() {
    this.closeIcon = false;
    this.searchParam = null;
    this.control.reset();
    this.search.emit(null);
    this.reset.emit();
  }
}
