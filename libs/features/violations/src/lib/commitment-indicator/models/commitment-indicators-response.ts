export class IndicatorsList {
    indicators: Indicators[] = [];
  }
  
export class Indicators {
    REGISTRATIONNUMBER: number;
    CMP_VALUE: number;
    BILL_VALUE: number;
    COMPOUND_VALUE_1: number;
    CERTIFICATE_ELIGIBILITY: number;
    VIOLATIONID_COUNT: number;
    OH_PERCENTAGE: number;
    CREATION_DATE: string;
    CMP_PERCENTAGE_RF: number;
    BILL_PERCENTAGE_RF: number;
    CERTIFICATE_ELIGIBILITY_PERCENTAGE_RF: number;
    OH_PERCENTAGE_RF: number;
    VIOLATIONID_PERCENTAGE_RF: number;
}

export class IndicatorsBreakupsData{
    wps: number;
    payments: number;
    violations: number;
    ohAndSafety: number;
    certificateEligibility: number;
}