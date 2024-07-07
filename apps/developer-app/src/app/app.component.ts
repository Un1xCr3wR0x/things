import { Component, OnInit } from '@angular/core';
import menu from '../assets/jsons/menu.json';
import { MenuItem, PushMessageService, StorageService, AppConstants } from '@gosi-ui/core';
import { SwUpdate } from '@angular/service-worker';
import { devToken } from '../../../../token.json';
@Component({
  selector: 'dev-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[];

  constructor(
    readonly pushMessageService: PushMessageService,
    readonly swUpdate: SwUpdate,
    readonly storageService: StorageService
  ) {
    this.menuItems = menu.menuItems;
    storageService.setLocalValue(AppConstants.AUTH_TOKEN_DEV, devToken.devAppToken);
    pushMessageService.updateToken();
  }
  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        location.reload();
      });
    }
  }
}
