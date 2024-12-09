import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAdministratifComponent } from './documents-administratif.component';

describe('DocumentsAdministratifComponent', () => {
  let component: DocumentsAdministratifComponent;
  let fixture: ComponentFixture<DocumentsAdministratifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsAdministratifComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsAdministratifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
