import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'dev-test-suite',
  templateUrl: './test-suite.component.html',
  styleUrls: ['./test-suite.component.scss']
})
export class TestSuiteComponent implements OnInit {
  requestUrl = new FormControl();

  constructor(private requetServce: RequestService) {}

  ngOnInit(): void {}

  submitRequest() {
    const body = this.requetServce.body$.getValue();
    this.requetServce.postData(this.requestUrl, body).subscribe(res => {
      //console.log(res);
    });
  }
}
