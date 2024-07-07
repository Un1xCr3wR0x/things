import { Directive, ViewContainerRef } from '@angular/core';

/**
 * This directive to implement dynamic component loading
 */
@Directive({
  selector: '[gosiComponentHost]'
})
export class ComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
