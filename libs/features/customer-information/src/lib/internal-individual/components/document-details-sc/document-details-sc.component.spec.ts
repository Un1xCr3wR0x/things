import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDetailsScComponent } from './document-details-sc.component';

describe('DocumentDetailsScComponent', () => {
  let component: DocumentDetailsScComponent;
  let fixture: ComponentFixture<DocumentDetailsScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentDetailsScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDetailsScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
