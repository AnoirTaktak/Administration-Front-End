import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ServiceService } from 'src/app/services/service_service/service-service.service';
import { Service } from 'src/Models/service';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    CommonModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    provideNativeDateAdapter(),
  ],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.scss'
})
export class EditServiceComponent {

  editServiceForm!: FormGroup;
  existingDess: any[] = [];
  isDateFinDisabled = false;
  //ServiceForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditServiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Service,  // Récupérer les données de l'employé sélectionné
    private fb: FormBuilder,
    private ServiceService: ServiceService
  ) {}

  ngOnInit(): void {

    this.loadServicesData();
    this.editServiceForm = this.fb.group({
      Designation_Service: [this.data.Designation_Service, Validators.required],
      PrixHT: [{ value: this.data.PrixHT, disabled: true }],
      TVA: [this.data.TVA, [Validators.required, this.tvaRangeValidator()]],
      PrixTTC : [this.data.PrixTTC, [Validators.required]],
    });

  }

tvaRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value !== null && (value < 7 || value > 20)) {
        return { tvaOutOfRange: true }; // Erreur si hors de la plage
      }
      return null; // Pas d'erreur
    };
  }

  updatePrixHT(): void {
    const tva = this.editServiceForm.get('TVA')?.value || 0;
    const prixTTC = this.editServiceForm.get('PrixTTC')?.value || 0;

    if (tva >= 7 && tva <= 20) {
      const prixHT = (prixTTC / (1 + tva / 100)).toFixed(2); // Calcul du HT
      this.editServiceForm.get('PrixHT')?.setValue(prixHT, { emitEvent: false }); // Mise à jour silencieuse
    }
  }


  loadServicesData(): void {
  this.ServiceService.getAllServices().subscribe(
    (Services: Service[]) => {
      this.existingDess = Services.map(e => e.Designation_Service != this.data.Designation_Service ? e.Designation_Service : null);


      console.log(this.existingDess);

      // Mettre à jour les validateurs des champs
      this.editServiceForm.get('Designation_Service')?.setValidators([
        Validators.required,

        this.uniqueValidator(this.existingDess, 'DesNotUnique')
      ]);
      this.editServiceForm.get('Designation_Service')?.updateValueAndValidity();


    },
    (error) => {
      console.error('Erreur lors du chargement des Services:', error);
    }
  );
  }
  isFieldInvalid(field: string): boolean {
    const control = this.editServiceForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }




  save(): void {
    console.log('Formulaire valide ?', this.editServiceForm.valid);
    console.log('Valeurs du formulaire :', this.editServiceForm.value);
    console.log('Valeurs injectées :', this.data);

    if (this.editServiceForm.valid) {
      const updatedService = {
        ...this.data,
        ...this.editServiceForm.value,
      };

      console.log('Service mis à jour :', updatedService);

      this.ServiceService.updateService(updatedService).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour :', error);
        },
      });
    }
  }



  close(): void {
    this.dialogRef.close(false);
  }

}
