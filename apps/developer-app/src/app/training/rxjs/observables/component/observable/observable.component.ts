import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'dev-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.scss']
})
export class ObservableComponent implements OnInit {
  // intervalObservable$: Observable<number>;
  value: number;
  subscription: Subscription;
  constructor() {}

  ngOnInit(): void {
    this.subscription = interval(1000).subscribe(res => {
      //console.log(`got a ${res}`);
      this.value = res;
    });
  }

  doUnsubscribe() {
    this.subscription.unsubscribe();
  }
}
