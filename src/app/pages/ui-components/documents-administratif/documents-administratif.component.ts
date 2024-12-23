import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { TypedocumentService } from 'src/app/services/typedocument/typedocument.service';
import { TypeDocument } from 'src/Models/typedocument'; // Assurez-vous d'avoir un modèle pour les types de documents
import { EmployeService } from 'src/app/services/employe/employe.service';
import { DocumentService } from 'src/app/services/document/document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SocieteService } from 'src/app/services/societe/societe.service';
import { Societe } from 'src/Models/societe';
import { Employe } from 'src/Models/employe';
import { Document } from 'src/Models/document';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-documents-administratif',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,


  ],
  templateUrl: './documents-administratif.component.html',
  styleUrls: ['./documents-administratif.component.scss'],
})
export class DocumentsAdministratifComponent implements OnInit {
  societe: Societe = {} as Societe;
  documentTypes: TypeDocument[] = [];
  employes: Employe[] = [];
  selectedDocumentType: any;
  selectedEmploye: any;
  pdfPreviewUrl: string | null = null;
  step = signal(0);
  addedData : any;
  requestData: any;
  doc = new jsPDF();
  pdfUrl: string | null = null;
  safeUrl: SafeResourceUrl;

  constructor(
    private typedocumentService: TypedocumentService,
    private employeService: EmployeService,
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    private societeService : SocieteService

  ) {}

  ngOnInit(): void {
    this.loadDocumentTypes();

    this.loadEmployes();

    this.consulterSociete();



  }

  /**
   * Charge les types de documents depuis le backend
   */
  loadDocumentTypes(): void {
    this.typedocumentService.getAllTypeDocuments().subscribe({
      next: (data) => {
        this.documentTypes = data ;

        console.log("Données de types Doc récupérées:", this.documentTypes);


    },
      error: () => this.showError('Erreur de chargement des types de documents.'),
    });
    console.log("Données de types documents:", this.documentTypes);
  }

  loadEmployes(): void {
    this.employeService.getAllEmployes().subscribe({
      next: (data) => {
        this.employes = data ;

        console.log("Données de employes récupérées:", this.employes);


    },
      error: () => this.showError('Erreur de chargement des employés.'),
    });
    console.log("Données de Employes récupérées:", this.employes);
  }
  consulterSociete(): void {
    console.log("Récupérer les paramètres de la société");
    this.societeService.getSocietes().subscribe({
        next: (data: Societe) => {
            this.societe = { ...data };

            console.log("Données de la société récupérées:", this.societe);


        },
        error: () => this.showError('Erreur de chargement des employés.'),
      });
  }


  /**
   * Action à effectuer lorsque l'utilisateur sélectionne un document et un employé
   */

  generatePDFContenu(): void {
    if (this.selectedDocumentType && this.selectedEmploye && this.societe) {
      // Préparer le contenu du PDF
      const pdf = new jsPDF();


      // Convertir le contenu PDF en Blob
      const pdfBlob = pdf.output('blob');

      // Préparer le formulaire pour l'envoi
      const formData = new FormData();
      formData.append('ID_Employe', this.selectedEmploye.ID_Employe.toString());
      formData.append('ID_TypeDocument', this.selectedDocumentType.ID_TypeDocument.toString());
      formData.append('ID_Societe', this.societe.ID_Societe.toString());
      formData.append('Date', "");
      formData.append('Contenu', "");
      formData.append('Doc_Pdf', new File([pdfBlob], 'Document.pdf', { type: 'application/pdf' }));

      // Appel du service pour créer le document
      this.documentService.createDocument(formData).subscribe({
        next: (response: any) => {
          this.addedData = response;
          console.log("Document créé avec succès:", response);
        },
        error: (error) => {
          console.error('Erreur lors de la création du document:', error);
        }
      });
    } else {
      console.error("Veuillez sélectionner un type de document, un employé et une société.");
    }
  }


  // Méthode pour convertir Base64 en ArrayBuffer
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }



   // Générer et afficher le PDF
   showPdf(): void {
    if (this.addedData?.FileContents) {
      // Convertir le contenu Base64 en un Blob et générer un URL d'objet
      const byteCharacters = atob(this.addedData.FileContents);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Créer une URL pour l'aperçu dans l'iframe
      const objectUrl = URL.createObjectURL(blob);
      this.pdfUrl = URL.createObjectURL(blob);
      // Utiliser DomSanitizer pour marquer cette URL comme sûre
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    } else {
      console.error('Contenu PDF introuvable.');
    }
  }

  openPdfInNewTab() {
    if (this.pdfUrl) {

      window.open(this.pdfUrl, '_blank');
    } else {
      console.error('Aucune URL PDF disponible.');
    }
  }

  downloadPDF() {
    if (this.addedData?.FileContents && this.addedData?.FileName) {
      const byteCharacters = atob(this.addedData.FileContents);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = this.addedData.FileName;
      link.click();
    } else {
      console.error('Impossible de télécharger le PDF.');
    }
  }

  // Impression du PDF
  printPDF(): void {
    const iframe: HTMLIFrameElement | null = document.querySelector('iframe');

    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.focus(); // Met le focus sur l'iframe
      iframe.contentWindow.print(); // Imprime le contenu de l'iframe
    } else {
      console.error('Aucun iframe ou contenu disponible pour impression.');
    }
  }



  selectDocument(type: any): void {
    this.selectedDocumentType = type;
  }

  setStep(index: number) {
    this.step.set(index);
  }

  nextStep() {
    this.step.update(i => i + 1);
  }

  prevStep() {
    this.step.update(i => i - 1);
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Fermer', { duration: 3000 });
  }
}

