import { Component, OnInit } from '@angular/core';
import { BaseComponent, MenuItem, LoginService, StartupService } from '@gosi-ui/core';
import menu from '../assets/jsons/menu.json';

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
  constructor(readonly loginService: LoginService, readonly startupService: StartupService) {
    super();
    this.menuItems = menu.menuItems;
  }
  ngOnInit() {
    this.loginService.checkLoginStatus();
  }
}
