import { NgModule } from '@angular/core';
import { CoreModule } from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { LoginDcComponent } from './login-dc.component';

@NgModule({
  declarations: [LoginDcComponent],
  imports: [CoreModule, ThemeModule]
})
export class LoginModule {}
