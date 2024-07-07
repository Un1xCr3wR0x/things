import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EstablishmentInfoByNinumber } from '../../../models/establishments/establishment-info-by-ninumber';

@Component({
  selector: 'fea-individual-establishments-dc',
  templateUrl: './individual-establishments-dc.component.html',
  styleUrls: ['./individual-establishments-dc.component.scss']
})
export class IndividualEstablishmentsDcComponent implements OnInit {
  paginationId = 'receivePayment';
  itemsPerPage = 3;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };

  @Input() establishmentInfoByNinumber: EstablishmentInfoByNinumber[] = [];
  @Input() lang = 'en';
  constructor(readonly router: Router) {}

  ngOnInit(): void {}

  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }

  goToEstablishmentsDetails(regNum) {
    this.router.navigate(['home/360/establishments/details/' + regNum]);
  }
}
