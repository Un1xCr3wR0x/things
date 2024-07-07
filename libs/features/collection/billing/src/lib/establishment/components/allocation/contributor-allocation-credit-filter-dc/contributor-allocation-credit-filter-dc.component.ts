import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ContributorAllocationFilterRequest, ContributorCreditAllocation } from '../../../../shared/models';

@Component({
  selector: 'blg-contributor-allocation-credit-filter-dc',
  templateUrl: './contributor-allocation-credit-filter-dc.component.html',
  styleUrls: ['./contributor-allocation-credit-filter-dc.component.scss']
})
export class ContributorAllocationCreditFilterDcComponent implements OnInit {
  // Local Variables
  lang = '';
  contributorAllocationFilterRequest: ContributorAllocationFilterRequest = new ContributorAllocationFilterRequest();
  billAmountFilterForm: FormGroup;
  allocatedAmountFilterForm: FormGroup;
  balanceAmountFilterForm: FormGroup;

  //  Output Variables
  @Output() allocationFiltervalues: EventEmitter<ContributorAllocationFilterRequest> = new EventEmitter();

  //  Input Variables
  @Input() individualAllocation: ContributorCreditAllocation;

  constructor(readonly modalService: BsModalService, private fb: FormBuilder) {}

  // This method is used to initialize data on loading
  ngOnInit(): void {
    this.billAmountFilterForm = this.fb.group({
      billAmount: new FormControl([0, 100000])
    });
    this.allocatedAmountFilterForm = this.fb.group({
      allocatedAmount: new FormControl([0, 100000])
    });

    this.balanceAmountFilterForm = this.fb.group({
      balanceAfterAllocation: new FormControl([0, 100000])
    });
  }
  // This method is used to apply the filter values
  applyFilter() {
    if (this.billAmountFilterForm.get('billAmount').value) {
      this.contributorAllocationFilterRequest.minBillAmount = this.billAmountFilterForm.get('billAmount').value[0];
      this.contributorAllocationFilterRequest.maxBillAmount = this.billAmountFilterForm.get('billAmount').value[1];
    } else {
      this.contributorAllocationFilterRequest.maxBillAmount = undefined;
      this.contributorAllocationFilterRequest.minBillAmount = undefined;
    }
    if (this.allocatedAmountFilterForm.get('allocatedAmount').value) {
      this.contributorAllocationFilterRequest.minAllocatedAmount = this.allocatedAmountFilterForm.get(
        'allocatedAmount'
      ).value[0];
      this.contributorAllocationFilterRequest.maxAllocatedAmount = this.allocatedAmountFilterForm.get(
        'allocatedAmount'
      ).value[1];
    } else {
      this.contributorAllocationFilterRequest.minAllocatedAmount = undefined;
      this.contributorAllocationFilterRequest.maxAllocatedAmount = undefined;
    }
    if (this.balanceAmountFilterForm.get('balanceAfterAllocation').value) {
      this.contributorAllocationFilterRequest.minBalanceAfterAllocation = this.balanceAmountFilterForm.get(
        'balanceAfterAllocation'
      ).value[0];
      this.contributorAllocationFilterRequest.maxBalanceAfterAllocation = this.balanceAmountFilterForm.get(
        'balanceAfterAllocation'
      ).value[1];
    } else {
      this.contributorAllocationFilterRequest.minBalanceAfterAllocation = undefined;
      this.contributorAllocationFilterRequest.maxBalanceAfterAllocation = undefined;
    }

    this.allocationFiltervalues.emit(this.contributorAllocationFilterRequest);
  }

  // This method is used to reset filter values on applying reset
  clearAllFilters() {
    this.billAmountFilterForm.reset();
    this.allocatedAmountFilterForm.reset();
    this.balanceAmountFilterForm.reset();
    this.contributorAllocationFilterRequest.maxBillAmount = undefined;
    this.contributorAllocationFilterRequest.minBillAmount = undefined;
    this.billAmountFilterForm = this.fb.group({
      billAmount: new FormControl([0, 100000])
    });
    this.contributorAllocationFilterRequest.minAllocatedAmount = undefined;
    this.contributorAllocationFilterRequest.maxAllocatedAmount = undefined;
    this.allocatedAmountFilterForm = this.fb.group({
      allocatedAmount: new FormControl([0, 100000])
    });
    this.contributorAllocationFilterRequest.minBalanceAfterAllocation = undefined;
    this.contributorAllocationFilterRequest.maxBalanceAfterAllocation = undefined;
    this.balanceAmountFilterForm = this.fb.group({
      balanceAfterAllocation: new FormControl([0, 100000])
    });
    this.allocationFiltervalues.emit(this.contributorAllocationFilterRequest);
  }
}
