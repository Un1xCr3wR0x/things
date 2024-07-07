import { NgModule } from '@angular/core';
import { CoreModule } from '@gosi-ui/core';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { SearchEstablishmentDcComponent } from './components/search-establishment-dc/search-establishment-dc.component';
import { LoginDcComponent } from './login-dc.component';

@NgModule({
  declarations: [LoginDcComponent, SearchEstablishmentDcComponent],
  imports: [CoreModule, ThemeModule]
})
export class LoginModule {}
