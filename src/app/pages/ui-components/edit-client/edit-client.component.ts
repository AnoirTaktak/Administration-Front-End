import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ClientService } from 'src/app/services/client/client.service';
import { Client, TypeClient } from 'src/Models/client';

@Component({
  selector: 'app-edit-client',
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
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss'
})
export class EditClientComponent {
  editClientForm!: FormGroup;
  existingMFs: any[] = [];
  existingRSs: any[] = [];
  isDateFinDisabled = false;
  //ClientForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditClientComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client,  // Récupérer les données de l'employé sélectionné
    private fb: FormBuilder,
    private ClientService: ClientService
  ) {}

  ngOnInit(): void {

    this.loadClientsData();
    this.editClientForm = this.fb.group({
      RS_Client: [this.data.RS_Client, Validators.required],
      MF_Client: [this.data.MF_Client, [Validators.required, Validators.pattern(/^[0-9]{7}[A-Za-z]{3}[0-9]{3}$/)]],
      Tel_Client: [this.data.Tel_Client, [Validators.required, Validators.pattern(/^\+216\d{8}$|^\d{8}$/)]],
      Adresse_Client : [this.data.Adresse_Client, [Validators.required]],
      Email_Client : [this.data.Email_Client, [Validators.required, Validators.email]],
      Type_Client: [this.data.Type_Client, Validators.required],
    });

  }

  loadClientsData(): void {
  this.ClientService.getAllClients().subscribe(
    (Clients: Client[]) => {
      this.existingMFs = Clients.map(e => e.MF_Client != this.data.MF_Client ? e.MF_Client : null);
      this.existingRSs = Clients.map(e => e.RS_Client != this.data.RS_Client ? e.RS_Client : null);

      console.log(this.existingMFs);
      console.log(this.existingRSs);
      // Mettre à jour les validateurs des champs
      this.editClientForm.get('MF_Client')?.setValidators([
        Validators.required,

        this.uniqueValidator(this.existingMFs, 'MFNotUnique')
      ]);
      this.editClientForm.get('MF_Client')?.updateValueAndValidity();

      this.editClientForm.get('RS_Client')?.setValidators([
        Validators.required,

        this.uniqueValidator(this.existingRSs, 'RSNotUnique')
      ]);
      this.editClientForm.get('RS_Client')?.updateValueAndValidity();
    },
    (error) => {
      console.error('Erreur lors du chargement des Clients:', error);
    }
  );
  }
  isFieldInvalid(field: string): boolean {
    const control = this.editClientForm.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  uniqueValidator(existingValues: string[], errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return existingValues.includes(control.value) ? { [errorKey]: true } : null;
    };
  }




  save(): void {
    console.log('Formulaire valide ?', this.editClientForm.valid);
    console.log('Valeurs du formulaire :', this.editClientForm.value);
    console.log('Valeurs injectées :', this.data);

    if (this.editClientForm.valid) {
      const updatedClient = {
        ...this.data,
        ...this.editClientForm.value,
        Type_Client: Number(this.editClientForm.value.Type_Client), // Conversion explicite en entier
      };

      console.log('Client mis à jour :', updatedClient);

      this.ClientService.updateClient(updatedClient).subscribe({
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
