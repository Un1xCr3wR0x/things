import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'dev-subscriber',
  templateUrl: './subscriber.component.html',
  styleUrls: ['./subscriber.component.scss']
})
export class SubscriberComponent implements OnInit {
  @Input() rxjsObject: Observable<string>;
  images: string[] = [];
  subscribed: boolean;
  subscription: Subscription;
  constructor() {}

  ngOnInit(): void {}

  subscribe() {
    this.subscribed = true;
    this.subscription = this.rxjsObject.subscribe(res => {
      if (res) {
        this.images.push(res);
      }
    });
  }

  unsubscribe() {
    this.subscribed = false;
    this.subscription.unsubscribe();
  }
}
