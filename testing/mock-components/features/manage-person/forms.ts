/**
 * Copyright GOSI. All Rights Reserved.
 * This software is the proprietary information of GOSI.
 * Use is subject to license terms.
 */

import { FormBuilder, Validators } from '@angular/forms';
import { lengthValidator } from '@gosi-ui/core';

export class ManagePersonForms {
  //Local Variables
  mobileMinLength = 5;
  mobileMaxLength = 15;
  extensionLength = 5;
  emailMaxLength = 35;
  borderLength = 10;
  iqamaLength = 10;

  fb: FormBuilder = new FormBuilder();
  getForm: void;
  constructor() {}

  //Method to get the contact details in a form
  public getContactMockForm() {
    return this.fb.group({
      contactDetail: this.fb.group({
        telephoneNo: this.fb.group({
          primary: [
            '',
            {
              validators: Validators.compose([
                Validators.maxLength(this.mobileMaxLength),
                Validators.pattern('[0-9]+')
              ]),
              updateOn: 'blur'
            }
          ],
          extensionPrimary: [
            '',
            {
              validators: Validators.compose([lengthValidator(this.extensionLength), Validators.pattern('[0-9]+')]),
              updateOn: 'blur'
            }
          ]
        }),
        emailId: this.fb.group({
          primary: [
            '',
            {
              validators: Validators.compose([Validators.email, Validators.maxLength(this.emailMaxLength)]),
              updateOn: 'blur'
            }
          ]
        }),
        mobileNo: this.fb.group({
          primary: [
            null,
            {
              validators: Validators.compose([Validators.required, Validators.pattern('[0-9]+')]),
              updateOn: 'blur'
            }
          ],
          isdCodePrimary: [null, { updateOn: 'blur' }]
        }),
        mobileNoVerified: [false]
      })
    });
  }

  //Method to get the bank details in a form
  public getBankMockForm() {
    return this.fb.group({
      bankForm: this.fb.group({
        isNonSaudiIBAN: [false, { updateOn: 'blur' }],
        ibanBankAccountNo: [
          null,
          {
            updateOn: 'blur'
          }
        ],
        bankName: this.fb.group({
          english: [null, { updateOn: 'blur' }],
          arabic: [null]
        }),
        bankAddress: [null, { updateOn: 'blur' }],
        swiftCode: [null, { updateOn: 'blur' }],
        bankCode: [null]
      })
    });
  }

  //Method to get the border details in a form
  public getBorderMockForm() {
    return this.fb.group({
      borderAdd: this.fb.group({
        borderNo: [null, Validators.required],
        type: ['BORDER', Validators.required],
        comments: ['testing']
      })
    });
  }
  //Method to get the iqama details in a form
  public getIqamaMockForm() {
    return this.fb.group({
      iqamaAdd: this.fb.group({
        iqamaNo: [
          null,
          {
            validators: Validators.compose([Validators.required]),
            updateOn: 'blur'
          }
        ],
        type: ['IQAMA', Validators.required],
        comments: [null]
      })
    });
  }
}
