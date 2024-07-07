/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
import { EntityTypeEstablishmentDcComponent } from './entity-type-establishment-dc/entity-type-establishment-dc.component';
import { EntityTypeSelectDcComponent } from './entity-type-select-dc/entity-type-select-dc.component';
import { EntityTypeVicDcComponent } from './entity-type-vic-dc/entity-type-vic-dc.component';
import { EntityTypeAllEntityDcComponent } from './entity-type-all-entity-dc/entity-type-all-entity-dc.component';
import { EstablishmentPenaltyWaiverScComponent } from './establishment-penalty-waiver-sc/establishment-penalty-waiver-sc.component';
import { VicPenaltyWaiverScComponent } from './vic-penalty-waiver-sc/vic-penalty-waiver-sc.component';
import { ExceptionalPenaltyWaiverHomepageScComponent } from './exception-penalty-waiver-hompage-sc/exception-penalty-waiver-homepage-sc.component';
import { EntityTypePenaltyWaiverScComponent } from './entity-type-penalty-waiver-sc/entity-type-penalty-waiver-sc.component';

export const ESTABLISHMENT_SERVICE_COMPONENTS = [
  ExceptionalPenaltyWaiverHomepageScComponent,
  EntityTypeEstablishmentDcComponent,
  EntityTypeSelectDcComponent,
  EntityTypeVicDcComponent,
  EntityTypeAllEntityDcComponent,
  EstablishmentPenaltyWaiverScComponent,
  VicPenaltyWaiverScComponent,
  EntityTypePenaltyWaiverScComponent
];

export * from './exception-penalty-waiver-hompage-sc/exception-penalty-waiver-homepage-sc.component';
export * from './entity-type-establishment-dc/entity-type-establishment-dc.component';
export * from './entity-type-select-dc/entity-type-select-dc.component';
export * from './entity-type-vic-dc/entity-type-vic-dc.component';
export * from './establishment-penalty-waiver-sc/establishment-penalty-waiver-sc.component';
export * from './vic-penalty-waiver-sc/vic-penalty-waiver-sc.component';
export * from './entity-type-penalty-waiver-sc/entity-type-penalty-waiver-sc.component';
export * from './entity-type-all-entity-dc/entity-type-all-entity-dc.component';
