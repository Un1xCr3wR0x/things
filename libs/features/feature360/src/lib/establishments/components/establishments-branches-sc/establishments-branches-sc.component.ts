import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';
import { EstablishmentBranches } from '../../../models/establishments/establishment-branches';
import { EstablishmentBranchesService } from '../../../services/establishments/establishment-branches.service';
import { EstablishmentsSearchDcComponent } from '../establishments-search-dc/establishments-search-dc.component';

@Component({
  selector: 'fea-establishments-branches-sc',
  templateUrl: './establishments-branches-sc.component.html',
  styleUrls: ['./establishments-branches-sc.component.scss']
})
export class EstablishmentsBranchesScComponent implements OnInit {
  // noOfRecords: 2;
  paginationId = 'receivePayment';
  itemsPerPage = 6;
  currentPage = 1;
  pageDetails = {
    currentPage: 1,
    goToPage: ''
  };

  establishmentId;
  lang = 'en';

  establishmentAllBranches: EstablishmentBranches[];
  searchResultBranches: EstablishmentBranches[];

  @ViewChild('establishmentsSearchComp', { static: false })
  establishmentsSearchComp: EstablishmentsSearchDcComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    readonly router: Router,
    readonly establishmentBranchesService: EstablishmentBranchesService,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.establishmentId = this.activatedRoute.snapshot.params.estId;
    this.getEstablishmentBranches();
    this.language.subscribe(language => (this.lang = language));
  }

  getEstablishmentBranches() {
    this.establishmentBranchesService
      .getEstablishmentBranches(this.establishmentId)
      .subscribe(establishmentBranches => {
        this.establishmentAllBranches = establishmentBranches;
        this.searchResultBranches = [...this.establishmentAllBranches];
      });
  }

  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }

  getBranchesDetails(establishmentFormDetails) {
    if (establishmentFormDetails) {
      this.searchResultBranches = [...this.filterDataByBranchName(establishmentFormDetails.data)];
    }
  }

  showDetails(regNum) {
    this.router.navigate(['home/360/establishments/details/' + regNum]);
  }

  filterDataByBranchName(searchTerm: string) {
    return this.establishmentAllBranches.filter(item => {
      return item.estnamearabic?.includes(searchTerm) || item.estnameenglish?.includes(searchTerm);
    });
  }
  showFormInvalid() {
    this.searchResultBranches = [...this.establishmentAllBranches];
  }
}
