import { Component, OnInit, EventEmitter, Output, Inject, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LovList, Lov, DocumentService, DocumentItem } from '@gosi-ui/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StaticDocuments as staticDocuments } from '../static-data';
import { ApplicationTypeEnum, ApplicationTypeToken } from '@gosi-ui/core';
import moment from 'moment-timezone';
@Component({
  selector: 'dev-multi-dropdown',
  templateUrl: './multi-dropdown.component.html',
  styleUrls: ['./multi-dropdown.component.scss']
})
export class MultiDropdownComponent implements OnInit {
  dropDownForm: FormGroup;
  dropDownList$: Observable<LovList>;
  establishmentSortList: LovList;
  documents: DocumentItem[] = [];
  injuryId: number;
  rejectTransactionId = 101553;
  complicationId: number;
  complicationDocuments: DocumentItem[] = [];
  isAppPrivate: boolean;
  isOtpValid: boolean;
  maxDateGreg: Date;
  maxDateCurrentGreg: Date;
  minDateHij: string;
  maxDateHij: string;
  minDateGreg: Date;
  periodControl: FormControl = new FormControl();
  @Input() businessKey: number;
  @Input() transactionId: string;
  /* Output Variable*/
  @Output() refreshDocument: EventEmitter<DocumentItem> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    readonly documentService: DocumentService,
    @Inject(ApplicationTypeToken) readonly appToken: string
  ) {}

  ngOnInit(): void {
    this.minDateHij = '04/05/1492';
    this.maxDateHij = '09/04/1492';
    this.minDateGreg = new Date('2010/01/01');
    this.maxDateGreg = new Date('2022/11/01');
    if (this.appToken === ApplicationTypeEnum.PRIVATE) {
      this.isAppPrivate = true;
    } else {
      this.isAppPrivate = false;
    }
    this.dropDownForm = this.createDropDownForm();
    this.getLovList();
    this.dropDownList$ = this.getLovList();
    this.maxDateCurrentGreg = moment(new Date()).toDate();
    /**
     * This method is used to get complication documents
     */
    this.getComplicationDocuments();
    this.isOtpValid = true;
    this.dropDownForm.addControl('otp', new FormControl(['', Validators.required]));

    this.establishmentSortList = {
      hasError: false,
      errorMessage: {
        english: undefined,
        arabic: undefined
      },
      items: [
        { sequence: 1, code: 1001, value: { arabic: 'شيك شخصي ', english: 'Establishment Number' } },
        { sequence: 2, code: 1002, value: { arabic: ' البنوك/ مصدقة', english: 'Register number' } },
        { sequence: 3, code: 1003, value: { arabic: ' مصدقة', english: 'status' } }
      ]
    };
  }
  getComplicationDocuments() {
    this.complicationDocuments.push(...staticDocuments.map(item => ({ ...new DocumentItem(), ...item })));
  }

  /**
   * Method for document refresh
   * @param document
   */
  refreshDocumentDetails(document: DocumentItem) {
    this.refreshDocument.emit(document);
  }

  hasRetriesExceeded() {}

  getLovList(): Observable<LovList> {
    const lovArray: Lov[] = [];
    [
      'Report of the Accident',
      'Civin of the accident',
      'Accident happened accidental',
      'Civin report strategy',
      'Happiness Project'
    ].some((itemValue, index) => {
      lovArray.push({
        sequence: index,
        value: { english: itemValue, arabic: itemValue }
      });
    });
    return of(new LovList(lovArray));
  }
  direction(res) {
    //console.log('fin res dir', res);
  }
  sortItemSelected(res) {
    //console.log('fin sortItemSelected', res);
  }

  createDropDownForm(): FormGroup {
    return this.fb.group({
      dropDownList: this.fb.group({
        english: ['', { Validators: Validators.required }],
        arabic: ['', { Validators: Validators.required }]
      }),
      checkBoxFlag: [null, { validators: Validators.required }],
      birthDate: this.fb.group({
        gregorian: [
          '',
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        hijiri1: [
          '',
          {
            validators: Validators.compose([Validators.required])
          }
        ],
        updateOn: 'blur'
      }),
      billAmount: new FormControl([20, 50])
    });
  }
}
