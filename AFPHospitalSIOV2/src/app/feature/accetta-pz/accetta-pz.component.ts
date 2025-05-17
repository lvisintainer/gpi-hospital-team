import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AFPHospitalAPIService } from '../../core/services/afphospital-api.service';
import { CodiceColore, CreazionePaziente } from '../../core/models/Paziente.model';

@Component({
  selector: 'app-accetta-pz',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './accetta-pz.component.html',
  styleUrl: './accetta-pz.component.scss',
})
export class AccettaPzComponent {
  private readonly api = inject(AFPHospitalAPIService);

  private readonly _nome = signal('');
  private readonly _cognome = signal('');
  private readonly _dataNascita = signal('');
  private readonly _codiceFiscale = signal('');
  private readonly _codiceColore = signal<CodiceColore>('NON FORNITO');

  get nome() { return this._nome(); }
  set nome(v: string) { this._nome.set(v); }

  get cognome() { return this._cognome(); }
  set cognome(v: string) { this._cognome.set(v); }

  get dataNascita() { return this._dataNascita(); }
  set dataNascita(v: string) { this._dataNascita.set(v); }

  get codiceFiscale() { return this._codiceFiscale(); }
  set codiceFiscale(v: string) { this._codiceFiscale.set(v); }

  get codiceColore() { return this._codiceColore(); }
  set codiceColore(v: CodiceColore) { this._codiceColore.set(v); }

  readonly dataNascitaParsed = computed(() =>
    this.dataNascita ? new Date(this.dataNascita) : null
  );

  private generaCodicePaziente(): string {
    return (
      this.nome.charAt(0).toUpperCase() +
      this.cognome.charAt(0).toUpperCase() +
      (this.dataNascitaParsed()?.getFullYear() ?? '')
    );
  }

  validateInput(): boolean {
    return (
      this.nome.trim().length > 0 &&
      this.cognome.trim().length > 0 &&
      this.codiceFiscale.trim().length === 16 &&
      this.codiceColore !== 'NON FORNITO' &&
      !!this.dataNascitaParsed()
    );
  }

async accettaPaziente(): Promise<void> {
  const nuovoPaziente: CreazionePaziente = {
    nome: this.nome.trim(),
    cognome: this.cognome.trim(),
    dataNascita: this.dataNascitaParsed()!,
    codiceFiscale: this.codiceFiscale.trim(),
    codiceColore: this.codiceColore,
    stato: 'IN CARICO',
    codice: this.generaCodicePaziente(),
  };

  try {
    await this.api.accettaPaziente(nuovoPaziente);
    // Ora la navigazione è completata
    this.resetForm();
  } catch (err) {
    console.error('Errore accettazione paziente', err);
  }
}


  private resetForm(): void {
    this._nome.set('');
    this._cognome.set('');
    this._dataNascita.set('');
    this._codiceFiscale.set('');
    this._codiceColore.set('NON FORNITO');
  }
}
