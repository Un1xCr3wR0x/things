import { MultipleTransferDetailsDcComponent } from "./multiple-transfer-details-dc/multiple-transfer-details-dc.component";
import { MultipleTransferIndividualDetailsDcComponent } from "./multiple-transfer-individual-details-dc/multiple-transfer-individual-details-dc.component";
import { MultipleTransferScComponent } from "./multiple-transfer-sc/multiple-transfer-sc.component";


export const TRANSFER_MULTIPLE_CONTRIBUTOR_COMPONENTS = [
    MultipleTransferScComponent, 
    MultipleTransferDetailsDcComponent,
    MultipleTransferIndividualDetailsDcComponent
]

export * from "./multiple-transfer-details-dc/multiple-transfer-details-dc.component";
export * from "./multiple-transfer-individual-details-dc/multiple-transfer-individual-details-dc.component";
export * from "./multiple-transfer-sc/multiple-transfer-sc.component";