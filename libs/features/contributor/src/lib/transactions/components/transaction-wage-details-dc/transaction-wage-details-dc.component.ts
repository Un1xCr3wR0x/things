import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UpdatedWageListResponse } from '../../../shared/models';

@Component({
  selector: 'cnt-transaction-wage-details-dc',
  templateUrl: './transaction-wage-details-dc.component.html',
  styleUrls: ['./transaction-wage-details-dc.component.scss']
})
export class TransactionWageDetailsDcComponent implements OnInit {
  @Input() updatedWageListResponse: UpdatedWageListResponse;
  @Input() isPPA = false;
  
  constructor() {}

  ngOnInit(): void {}
}
