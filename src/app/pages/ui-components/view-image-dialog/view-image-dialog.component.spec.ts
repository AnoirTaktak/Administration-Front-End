import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImageDialogComponent } from './view-image-dialog.component';

describe('ViewImageDialogComponent', () => {
  let component: ViewImageDialogComponent;
  let fixture: ComponentFixture<ViewImageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewImageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewImageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
