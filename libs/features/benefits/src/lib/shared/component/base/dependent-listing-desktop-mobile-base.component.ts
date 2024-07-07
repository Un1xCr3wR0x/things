import { Directive, Input } from '@angular/core';
import { ListPersonBaseComponent } from './list-person.base.component';
@Directive()
export abstract class DependentListingDesktopMobileBaseComponent extends ListPersonBaseComponent {
  @Input() requestDateChangedByValidator: boolean;
}
