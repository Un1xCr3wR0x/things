import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from '@gosi-ui/core';
import adminMenu from '../../assets/jsons/adminMenu.json';

@Component({
  selector: 'est-complete-admin-details-dc',
  templateUrl: './complete-admin-details-dc.component.html',
  styleUrls: ['./complete-admin-details-dc.component.scss']
})
export class CompleteAdminDetailsDcComponent implements OnInit {
  @Input()
  menuItems: MenuItem[];
  constructor() {
    this.menuItems = adminMenu.menuItems;
  }

  ngOnInit() {}
}
