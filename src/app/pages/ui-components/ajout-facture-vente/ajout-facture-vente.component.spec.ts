import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutFactureVenteComponent } from './ajout-facture-vente.component';

describe('AjoutFactureVenteComponent', () => {
  let component: AjoutFactureVenteComponent;
  let fixture: ComponentFixture<AjoutFactureVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjoutFactureVenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjoutFactureVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
