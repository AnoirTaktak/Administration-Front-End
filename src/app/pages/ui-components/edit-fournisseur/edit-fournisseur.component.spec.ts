import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFournisseurComponent } from './edit-fournisseur.component';

describe('EditFournisseurComponent', () => {
  let component: EditFournisseurComponent;
  let fixture: ComponentFixture<EditFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFournisseurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
