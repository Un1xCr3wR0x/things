import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { BilingualText, LanguageToken } from '@gosi-ui/core';
import { BehaviorSubject } from 'rxjs-compat';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'gosi-ui-history-search',
  templateUrl: './history-search.component.html',
  styleUrls: ['./history-search.component.scss']
})
export class HistorySearchComponent implements OnInit , AfterViewInit{
  @Output() searchCallbaclEvent = new EventEmitter<{searchType:string,searchData:string}>();
  @Output() searchContributor: EventEmitter<number> = new EventEmitter();
  
  placeholder:string= "";
  seachType: any = 'trnsactionID';
  sortListForm: FormGroup;
  selectedOption: any;
  
  lang: string;
  constructor(
    @Inject(LanguageToken) readonly language: BehaviorSubject<string>,
    readonly translate : TranslateService) {}

  ngOnInit(): void {
    this.language.subscribe(language => {
      this.lang = language;
    });
  }

 ngAfterViewInit(): void {
  setTimeout(() => {
    if(this.lang == "ar"){
      this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-TRN-ID").arabic;
    }else{
      this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-TRN-ID").english;
    }
  }, 1000);
 
   
 }

  onSearch(searchParams: string){
    this.searchCallbaclEvent.emit({searchType:this.seachType,searchData:searchParams});
  }
  selectType(event) {
    this.searchContributor.emit(null);
    this.seachType = event;
    if(event == "sourceEmployee"){
      if(this.lang == "ar"){
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-SOURCE-USER").arabic;
      }else{
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-SOURCE-USER").english;
      }
    }
    else if(event == "targetEmployee"){
      if(this.lang == "ar"){
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-TARGET-USER").arabic;
      }else{
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-TARGET-USER").english;
      }
    }
    else if(event == "trnsactionID"){
      if(this.lang == "ar"){
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-TRN-ID").arabic;
      }else{
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-TRN-ID").english;
      }
    }
    else if(event == "applicant"){
      if(this.lang == "ar"){
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-APPLICANT").arabic;
      }else{
        this.placeholder = this.getTranslationBilingualByKey("TEAM-MANAGEMENT.SEARCH-BY-APPLICANT").english;
      }
    }
     
  }
  
  resetSearch() {
    this.searchContributor.emit(null);
  }


  getTranslationBilingualByKey(key:string){
    let message = new BilingualText();
    message.english =  this.translate.instant(key);
    message.arabic =  this.translate.instant(key);
    return message;
  }

}
