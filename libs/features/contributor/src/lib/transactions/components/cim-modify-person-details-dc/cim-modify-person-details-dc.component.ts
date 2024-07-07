import { Component, Input, OnInit } from '@angular/core';
import { ModifyRequestList } from '../../../shared';

@Component({
  selector: 'cnt-cim-modify-person-details-dc',
  templateUrl: './cim-modify-person-details-dc.component.html',
  styleUrls: ['./cim-modify-person-details-dc.component.scss']
})
export class CimModifyPersonDetailsDcComponent implements OnInit {

  @Input() modifyRequestList:ModifyRequestList;
  constructor() { }

  ngOnInit(): void {
  }

}
