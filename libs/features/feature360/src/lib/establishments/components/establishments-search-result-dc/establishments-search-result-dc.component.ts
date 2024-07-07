import { Component, Inject, Input, OnInit } from '@angular/core';
import { EstablishmentProfile } from '../../../models/establishments/establishment-profile';
import { EstablishmentBranches } from '../../../models/establishments/establishment-branches';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'fea-establishments-search-result',
  templateUrl: './establishments-search-result-dc.component.html',
  styleUrls: ['./establishments-search-result-dc.component.scss']
})
export class EstablishmentsSearchResultDcComponent implements OnInit {
  establishments = [];
  lang = 'en';

  @Input() establishmentProfile: EstablishmentProfile;
  @Input() branchesData: EstablishmentBranches[];

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>
  ) {}

  ngOnInit(): void {
    this.establishments.push(this.establishmentProfile);
    this.language.subscribe(language => (this.lang = language));
  }

  goToBranchDetails(estId) {
    this.router.navigate(['home/360/establishments/branches/' + estId]);
  }

  goToEstablishmentsDetails(regNum) {
    this.router.navigate(['home/360/establishments/details/' + regNum]);
  }
}
