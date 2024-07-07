import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewScComponent } from './document-view-sc.component';

describe('DocumentViewScComponent', () => {
  let component: DocumentViewScComponent;
  let fixture: ComponentFixture<DocumentViewScComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentViewScComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentViewScComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
