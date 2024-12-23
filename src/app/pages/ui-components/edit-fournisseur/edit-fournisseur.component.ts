import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FournisseurService } from 'src/app/services/fournisseur/fournisseur.service';
import { Fournisseur } from 'src/Models/fournisseur';

@Component({
  selector: 'app-edit-fournisseur',
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
  templateUrl: './edit-fournisseur.component.html',
  styleUrl: './edit-fournisseur.component.scss'
})
export class EditFournisseurComponent {

  editFournisseurForm!: FormGroup;
  existingMFs: any[] = [];
  existingRSs: any[] = [];
  isDateFinDisabled = false;
  //FournisseurForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditFournisseurComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Fournisseur,  // Récupérer les données de l'employé sélectionné
    private fb: FormBuilder,
    private FournisseurService: FournisseurService
  ) {}

  ngOnInit(): void {

    this.loadFournisseursData();
    this.editFournisseurForm = this.fb.group({
      RaisonSociale_Fournisseur: [this.data.RaisonSociale_Fournisseur, Validators.required],
      MF_Fournisseur: [this.data.MF_Fournisseur, [Validators.required, Validators.pattern(/^[0-9]{7}[A-Za-z]{3}[0-9]{3}$/)]],
      Tel_Fournisseur: [this.data.Tel_Fournisseur, [Validators.required, Validators.pattern(/^\+216\d{8}$|^\d{8}$/)]],
      Adresse_Fournisseur : [this.data.Adresse_Fournisseur, [Validators.required]],
      Email_Fournisseur : [this.data.Email_Fournisseur, [Validators.required, Validators.email]],
      Type_Fournisseur: [this.data.Type_Fournisseur, Validators.required],
    });

  }

  loadFournisseursData(): void {
  this.FournisseurService.getAllFournisseurs().subscribe(
    (Fournisseurs: Fournisseur[]) => {
      this.existingMFs = Fournisseurs.map(e => e.MF_Fournisseur != this.data.MF_Fournisseur ? e.MF_Fournisseur : null);
      this.existingRSs = Fournisseurs.map(e => e.RaisonSociale_Fournisseur != this.data.RaisonSociale_Fournisseur ? e.RaisonSociale_Fournisseur : null);

      console.log(this.existingMFs);
      console.log(this.existingRSs);
       // Mettre à jour les validateurs des champs
       this.editFournisseurForm.get('MF_Fournisseur')?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{7}[A-Za-z]{3}[0-9]{3}$/),
        this.uniqueValidator(this.existingMFs, 'MFNotUnique')
      ]);
      this.editFournisseurForm.get('CIN_Fournisseur')?.updateValueAndValidity();

      this.editFournisseurForm.get('RaisonSociale_Fournisseur')?.setValidators([
        Validators.required,
        this.uniqueValidator(this.existingRSs, 'RSNotUnique')
      ]);
      this.editFournisseurForm.get('RaisonSociale_Fournisseur')?.updateValueAndValidity();
    },
    (error) => {
      console.error('Erreur lors du chargement des Fournisseurs:', error);
    }
  );
  }

  isFieldInvalid(field: string): boolean {
    const control = this.editFournisseurForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }


  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }




  save(): void {
    console.log('Formulaire valide ?', this.editFournisseurForm.valid);
    console.log('Valeurs du formulaire :', this.editFournisseurForm.value);
    console.log('Valeurs injectées :', this.data);

    if (this.editFournisseurForm.valid) {
      const updatedFournisseur = {
        ...this.data,
        ...this.editFournisseurForm.value,
      };


      console.log('Fournisseur mis à jour :', updatedFournisseur);

      this.FournisseurService.updateFournisseur(updatedFournisseur).subscribe({
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
