import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ContributorDetail} from "@gosi-ui/features/violations/lib/shared/models/contributor-detail";


@Component({
  selector: 'vol-violation-appeal-contributor-selection-dc',
  templateUrl: './violation-appeal-contributor-selection-dc.component.html',
  styleUrls: ['./violation-appeal-contributor-selection-dc.component.scss']
})


export class ViolationAppealContributorSelectionDcComponent
  implements OnInit, OnChanges {

  @Input() isSelectedAll: boolean;
  @Input() records: number;
  @Output() searchContributor: EventEmitter<number> = new EventEmitter();
  @Output() selectedContributors: EventEmitter<number> = new EventEmitter();
  // @Output() selectedContributors: EventEmitter<ContributorDetail> = new EventEmitter();
  @Output() chosenContributor: EventEmitter<ContributorDetail> = new EventEmitter();
  @Input() contributorIds: number[];
  @Input() contributorsList: ContributorDetail[] = [];
  @Output() selectAllContributors: EventEmitter<boolean> = new EventEmitter();
  @Output() selectPageNo: EventEmitter<number> = new EventEmitter();
  @Output() nextPage: EventEmitter<null> = new EventEmitter<null>();
  @Input() noOfRecords: number;

  @Input() itemsPerPage: number;
  @Input() currentPage: number;
  @Input() pageDetails: { currentPage: number, goToPage: string };
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  totalRecords : string | number =4;


  constructor() {
  }

  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges) {
    // this.loadingData = changes.loadingData.currentValue;
    // console.log(this.loadingData)
  }

  onChangeSelectAllContributor(event: Event) {
    const isSelectedAll = (event.target as HTMLInputElement).checked;
    this.selectAllContributors.emit(isSelectedAll);
  }

  onChangeSelectContributor(event: Event, index: number) {
    this.selectedContributors.emit(index);
  }

  onNextAppealDetail() {
    this.nextPage.emit(null);
  }

  search(ninOrIqama: number) {
    this.searchContributor.emit(ninOrIqama);
  }

  selectPage(page: number): void {
    if (this.pageDetails.currentPage !== page) {
      this.pageDetails.currentPage = this.currentPage = page;
    }
  }

  resetSearch() {
    this.searchContributor.emit(null);
  }
}
