/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */
export class Content{
    Request: Request; 
  }
  export class Request {
   Body: Body;
  }
  
  export class Body {
   roleId: string = undefined;
   resource: string = undefined;
  }
  
