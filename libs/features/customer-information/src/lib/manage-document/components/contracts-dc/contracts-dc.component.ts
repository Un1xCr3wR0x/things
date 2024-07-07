import { Component, OnInit, Input } from '@angular/core';
import { Contract } from '../../../shared';

@Component({
  selector: 'cim-contracts-dc',
  templateUrl: './contracts-dc.component.html',
  styleUrls: ['./contracts-dc.component.scss']
})
export class ContractsDcComponent implements OnInit {
  @Input() contracts: Contract[];

  constructor() {}

  ngOnInit() {}
}
