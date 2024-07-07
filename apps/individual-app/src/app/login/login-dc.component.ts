import { Component, OnInit } from '@angular/core';
import menu from '../../assets/jsons/menu.json';
import { MenuItem } from '@gosi-ui/core';

@Component({
  selector: 'est-login-dc',
  templateUrl: './login-dc.component.html',
  styleUrls: ['./login-dc.component.scss']
})
export class LoginDcComponent implements OnInit {
  menuItems: MenuItem[];

  constructor() {
    this.menuItems = menu.menuItems;
  }

  ngOnInit() {}
}
