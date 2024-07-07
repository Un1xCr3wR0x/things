import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentTableDcComponent } from './comment-table-dc.component';

describe('CommentTableDcComponent', () => {
  let component: CommentTableDcComponent;
  let fixture: ComponentFixture<CommentTableDcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentTableDcComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentTableDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
