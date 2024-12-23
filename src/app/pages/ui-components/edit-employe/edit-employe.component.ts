import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, FormGroupName, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Employe, TypeContrat } from 'src/Models/employe';
import { EmployeService } from 'src/app/services/employe/employe.service';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-employe-edit',
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
  templateUrl: './edit-employe.component.html',
  styleUrls: ['./edit-employe.component.scss']
})
export class EditEmployeComponent implements OnInit {

  editEmployeForm!: FormGroup;
  existingCINs: any[] = [];
existingCNSSs: any[] = [];
existingNoms: any[] = [];
isDateFinDisabled = false;
  //employeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditEmployeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Employe,  // Récupérer les données de l'employé sélectionné
    private fb: FormBuilder,
    private employeService: EmployeService
  ) {}

  ngOnInit(): void {

    this.loadEmployesData();
    this.editEmployeForm = this.fb.group({
      Nom_Employe: [this.data.Nom_Employe, [Validators.required,this.uniqueValidator(this.existingNoms, 'nomNotUnique')]],
      Poste_Employe: [this.data.Poste_Employe, Validators.required],
      CIN_Employe: [
        this.data.CIN_Employe,
        [
          Validators.required,
          Validators.pattern(/^\d{8}$/),
          this.uniqueValidator(this.existingCINs, 'cinNotUnique'),
        ],
      ],
      CNSS_Employe: [
        this.data.CNSS_Employe,
        [
          Validators.required,
          Validators.pattern(/^\d+$/),
          this.uniqueValidator(this.existingCNSSs, 'cnssNotUnique'),
        ],
      ],
      Tel_Employe: [this.data.Tel_Employe, [Validators.required, Validators.pattern(/^\+216\d{8}$|^\d{8}$/)]],
      Salaire: [this.data.Salaire, [Validators.required, Validators.min(1)]],
      TypeContrat: [this.data.TypeContrat, Validators.required],
      Email_Employe: [this.data.Email_Employe, [Validators.required, Validators.email]],
      DateDebut: [this.data.DateDebut, Validators.required],
      DateFin: [this.data.DateFin, this.dateRangeValidator()],
    });


   // Surveiller les changements de 'TypeContrat' et désactiver 'DateFin' si CDI est sélectionné
  this.editEmployeForm.get('TypeContrat')?.valueChanges.subscribe((value) => {
    if (value === '1') { // CDI
      this.editEmployeForm.get('DateFin')?.disable(); // Désactive le champ DateFin
      this.editEmployeForm.get('DateFin')?.clearValidators(); // Enlève la validation de DateFin
      this.editEmployeForm.get('DateFin')?.updateValueAndValidity();
    } else {
      this.editEmployeForm.get('DateFin')?.enable(); // Active le champ DateFin
      this.editEmployeForm.get('DateFin')?.setValidators(this.dateRangeValidator()); // Restaure la validation de DateFin
      this.editEmployeForm.get('DateFin')?.updateValueAndValidity();
    }
  });
  }

  loadEmployesData(): void {
  this.employeService.getAllEmployes().subscribe(
    (employes: Employe[]) => {
      this.existingCINs = employes.map(e => e.CIN_Employe != this.data.CIN_Employe ? e.CIN_Employe : null);
      this.existingCNSSs = employes.map(e => e.CNSS_Employe != this.data.CNSS_Employe ? e.CNSS_Employe : null);
      this.existingNoms = employes.map(e => e.Nom_Employe != this.data.Nom_Employe ? e.Nom_Employe : null);

      console.log(this.existingCINs);
      console.log(this.existingCNSSs);
      // Mettre à jour les validateurs des champs
      this.editEmployeForm.get('CIN_Employe')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{8}$/),
        this.uniqueValidator(this.existingCINs, 'cinNotUnique')
      ]);
      this.editEmployeForm.get('CIN_Employe')?.updateValueAndValidity();

      this.editEmployeForm.get('Nom_Employe')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingNoms, 'nomNotUnique')
      ]);
      this.editEmployeForm.get('Nom_Employe')?.updateValueAndValidity();

      this.editEmployeForm.get('CNSS_Employe')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d+$/),
        this.uniqueValidator(this.existingCNSSs, 'cnssNotUnique')
      ]);
      this.editEmployeForm.get('CNSS_Employe')?.updateValueAndValidity();
    },
    (error) => {
      console.error('Erreur lors du chargement des employés:', error);
    }
  );
  }
  isFieldInvalid(field: string): boolean {
    const control = this.editEmployeForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }

  dateRangeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = this.editEmployeForm?.get('DateDebut')?.value;
      const endDate = control.value;
      if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        return { invalidRange: true };
      }
      return null;
    };
  }



  save(): void {
    console.log('Formulaire valide ?', this.editEmployeForm.valid);
    console.log('Valeurs du formulaire :', this.editEmployeForm.value);
    console.log('Valeurs injectées :', this.data);

    if (this.editEmployeForm.valid) {
      const updatedEmploye = {
        ...this.data,
        ...this.editEmployeForm.value,
        TypeContrat: Number(this.editEmployeForm.value.TypeContrat), // Conversion explicite en entier
      };

      console.log('Employé mis à jour :', updatedEmploye);

      this.employeService.updateEmploye(updatedEmploye).subscribe({
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
