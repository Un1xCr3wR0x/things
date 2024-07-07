import { Component, OnInit } from '@angular/core';
import menu from '../../assets/jsons/menu.json';
import { MenuItem } from '@gosi-ui/core';

@Component({
  selector: 'bnt-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.css']
})
export class AppShellComponent implements OnInit {
  menuItems: MenuItem[];

  constructor() {
    this.menuItems = menu.menuItems;
  }

  ngOnInit() {}
}
