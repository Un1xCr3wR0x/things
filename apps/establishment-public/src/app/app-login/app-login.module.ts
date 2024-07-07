import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { AppLoginDcComponent } from './app-login-dc.component';
import { AppLoginScComponent } from './components/app-login-sc/app-login-sc.component';

@NgModule({
  declarations: [AppLoginDcComponent, AppLoginScComponent],
  imports: [CommonModule, ThemeModule]
})
export class AppLoginModule {}
