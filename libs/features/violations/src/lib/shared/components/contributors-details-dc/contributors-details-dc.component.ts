import { Component, Input, OnInit } from '@angular/core';
import { DocumentItem } from '@gosi-ui/core';

@Component({
  selector: 'vol-contributors-details-dc',
  templateUrl: './contributors-details-dc.component.html',
  styleUrls: ['./contributors-details-dc.component.scss']
})
export class ContributorsDetailsDcComponent implements OnInit {
  @Input() documents: DocumentItem[];
  constructor() {}

  ngOnInit(): void {}
}
