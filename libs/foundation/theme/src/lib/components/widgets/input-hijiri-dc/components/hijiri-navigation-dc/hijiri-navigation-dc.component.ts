import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, throttleTime } from 'rxjs/operators';
import { YearsCalendarViewModel } from '../../models';
const bounceTime = 300;
@Component({
  selector: 'gosi-hijiri-navigation-dc',
  templateUrl: './hijiri-navigation-dc.component.html',
  styleUrls: ['./hijiri-navigation-dc.component.scss']
})
export class HijiriNavigationDcComponent implements OnInit, OnDestroy, OnChanges {
  @Input() calendar: YearsCalendarViewModel;
  @Input() title: string;

  /**
   * Output variables to communicate with parent component
   */
  @Output() onNavigate: EventEmitter<number> = new EventEmitter();
  @Output() onViewMode: EventEmitter<string> = new EventEmitter();
  readonly click = new Subject();
  private subscription: Subscription;
  constructor() {}

  ngOnInit() {
    this.subscription = this.click.pipe(debounceTime(bounceTime), throttleTime(bounceTime * 2)).subscribe(e => {
      e ? this.onNavigate.emit(1) : this.onNavigate.emit(-1);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.calendar && changes.calendar.currentValue) {
      this.calendar = changes.calendar.currentValue;
    }
  }

  navTo(forward) {
    this.click.next(forward);
  }

  view(e) {
    this.onViewMode.emit(e);
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
