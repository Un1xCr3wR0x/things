import { BilingualText } from "@gosi-ui/core";
import { AttorneyInquiryAgent } from "./attorney-inquiry-agent";
import { AttorneyInquiryAuthorizerList } from "./attorney-inquiry-authorizer-list";
import { AttorneyInquiryEndDate } from "./attorney-inquiry-end-date";
import { AttorneyInquiryIssueDate } from "./attorney-inquiry-issue-date";

export class AttorneyInquiryResponse {
    responseCode: boolean;
    responseMessage: BilingualText;
    attorneyNumber: string;
    attorneyStatus: string;
    attorneyType: string;
    attorneyStatusId: string;
    agent: AttorneyInquiryAgent;
    authorizerList: AttorneyInquiryAuthorizerList[];
    issueDate: AttorneyInquiryIssueDate;
    endDate: AttorneyInquiryEndDate;
    attorneyText: string;
}