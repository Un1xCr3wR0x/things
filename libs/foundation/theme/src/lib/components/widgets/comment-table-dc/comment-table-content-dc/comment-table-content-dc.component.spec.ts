import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentTableContentDcComponent } from './comment-table-content-dc.component';

describe('CommentTableContentDcComponent', () => {
  let component: CommentTableContentDcComponent;
  let fixture: ComponentFixture<CommentTableContentDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentTableContentDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentTableContentDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
