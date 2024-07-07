import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dev-content-dc',
  template: ` <div class="content">
    <router-outlet></router-outlet>
  </div>`
})
export class ContentDcComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
