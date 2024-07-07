import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationsScComponent } from './translations-sc/translations-sc.component';
import { ThemeModule } from '@gosi-ui/foundation-theme';

@NgModule({
  declarations: [TranslationsScComponent],
  imports: [CommonModule, ThemeModule]
})
export class TranslationsModule {}
