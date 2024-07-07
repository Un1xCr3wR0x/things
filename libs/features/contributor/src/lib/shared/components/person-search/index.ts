/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { ContributorTypeDcComponent } from './contributor-type-dc/contributor-type-dc.component';
import { EstablishmentSearchDcComponent } from './establishment-search-dc/establishment-search-dc.component';
import { PersonSearchScComponent } from './person-search-sc/person-search-sc.component';
import { SearchGccDcComponent } from './search-gcc-dc/search-gcc-dc.component';
import { SearchImmigratedTribeDcComponent } from './search-immigrated-tribe-dc/search-immigrated-tribe-dc.component';
import { SearchNonSaudiDcComponent } from './search-non-saudi-dc/search-non-saudi-dc.component';
import { SearchSaudiDcComponent } from './search-saudi-dc/search-saudi-dc.component';
import { SearchSplForeignerDcComponent } from './search-spl-foreigner-dc/search-spl-foreigner-dc.component';

export const PERSON_SEARCH_COMPONENTS = [
  PersonSearchScComponent,
  SearchSaudiDcComponent,
  SearchNonSaudiDcComponent,
  SearchImmigratedTribeDcComponent,
  SearchSplForeignerDcComponent,
  SearchGccDcComponent,
  EstablishmentSearchDcComponent,
  ContributorTypeDcComponent
];

export * from './contributor-type-dc/contributor-type-dc.component';
export * from './establishment-search-dc/establishment-search-dc.component';
export * from './person-search-sc/person-search-sc.component';
export * from './search-gcc-dc/search-gcc-dc.component';
export * from './search-immigrated-tribe-dc/search-immigrated-tribe-dc.component';
export * from './search-non-saudi-dc/search-non-saudi-dc.component';
export * from './search-saudi-dc/search-saudi-dc.component';
export * from './search-spl-foreigner-dc/search-spl-foreigner-dc.component';
