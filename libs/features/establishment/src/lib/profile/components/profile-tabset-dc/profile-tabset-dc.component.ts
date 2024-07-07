import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Tab } from '@gosi-ui/core';

@Component({
  selector: 'est-profile-tabset-dc',
  templateUrl: './profile-tabset-dc.component.html',
  styleUrls: ['./profile-tabset-dc.component.scss']
})
export class ProfileTabsetDcComponent implements OnInit, OnChanges {
  @Input() profileTabs: Tab[] = [];
  @Input() hasRouterOutlet = false;
  @Output() navigate: EventEmitter<string> = new EventEmitter();
  showDropDown = false;
  activeInDropdown = false;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.profileTabs?.currentValue) {
      this.profileTabs = changes?.profileTabs?.currentValue;
    }
    if (changes?.hasRouterOutlet?.currentValue) {
      this.hasRouterOutlet = changes?.hasRouterOutlet?.currentValue;
    }
  }
  onDropDownClick() {
    this.showDropDown = !this.showDropDown;
  }
  onTabSelect(url: string) {
    this.navigate.emit(url);
  }
}
