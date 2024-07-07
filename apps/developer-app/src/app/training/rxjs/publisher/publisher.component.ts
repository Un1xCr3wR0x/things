import { Component, Input, OnInit } from '@angular/core';
import { Observer } from 'rxjs';

@Component({
  selector: 'dev-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss']
})
export class PublisherComponent implements OnInit {
  @Input() rxjsObject: Observer<string>;
  constructor() {}

  ngOnInit(): void {}

  uploadFile(fileList: FileList) {
    const file = fileList[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    const self = this;
    fileReader.onloadend = function () {
      self.rxjsObject.next(fileReader.result.toString());
    };
  }
}
