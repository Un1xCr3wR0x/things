import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeModule } from '@gosi-ui/foundation-theme';
import { WIDGETS } from '../pocs';

@NgModule({
  declarations: [WIDGETS],
  imports: [CommonModule, ThemeModule, FormsModule],
  exports: [WIDGETS]
})
export class PocsModule {}
