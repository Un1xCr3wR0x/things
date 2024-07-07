import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { BaseComponent, MenuItem, LoginService } from '@gosi-ui/core';
import menu from '../assets/jsons/menu.json';
import { Router, RouterEvent, RouteConfigLoadStart } from '@angular/router';

@Component({
  selector: 'est-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  menuItems: MenuItem[];
  userId = 'user1';
  /**
   * Creates an instance of HomeComponent
   * @memberof  HomeComponent
   *
   */
  constructor(private router: Router, readonly loginService: LoginService) {
    super();
    this.menuItems = menu.menuItems;
  }
  ngOnInit() {
    this.loginService.checkLoginStatus();
  }
}
