import { BilingualText } from "@gosi-ui/core";

export class Repatriation {
    shippingAmount: number;
    bodyPrepAmount: number;
    docCopyAmount: number;
    embVerfAmount: number;
    airportConvAmount: number;
    translationAmount: number;
    familyNotiExpenseAmount: number;
    airportServicesExpenseAmount: number;
    settlementId: number;
    // isAdminSubmit?: boolean;
    referenceNo?: number;
}

export class RepatriationResponse{
    referenceNo: number;
    responseMessage: BilingualText;
    code: number;
    message: string;
    invoiceNo: number;
    settlementId: number;
    bilingualMessage: BilingualText;
}

export class RepatriationDto {
    deadBodyRepatriationDto: modifiedRepatriation[];
    modifiedDeadBodyRepatriationDto: modifiedRepatriation[];
    rejectionReason?: BilingualText;
}

export class modifiedRepatriation {
    claimType: BilingualText;
    amount: number;
}

export class overallRepatriation {
    claimType: BilingualText;
    oldAmount: number;
    newAmount: number;
}