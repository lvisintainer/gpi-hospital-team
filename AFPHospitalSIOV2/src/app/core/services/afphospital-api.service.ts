import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { retry, finalize, map } from 'rxjs/operators';
import { Paziente, CreazionePaziente } from '../models/Paziente.model';
import { HttpRes } from '../models/RespManager';

@Injectable({
  providedIn: 'root'
})
export class AFPHospitalAPIService {
  // URL base API
  readonly URL = "http://localhost:3000";

  // Inject servizi Angular
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signal privata con la lista pazienti
  private readonly _listaPz = signal<Paziente[]>([]);
  // computed pubblica per leggere la lista pazienti
  listaPz = computed(() => this._listaPz());

  /**
   * Recupera lista pazienti da backend e aggiorna la signal
   */
  getListaPazienti(): void {
    this.http.get<HttpRes>(`${this.URL}/lista-pz`).pipe(
      retry(3),
      map(res => JSON.parse(res.body as string) as Paziente[])
    ).subscribe({
      next: data => this._listaPz.set(data),
      error: err => console.error('Errore caricamento lista pazienti', err)
    });
  }

  /**
   * Accetta un nuovo paziente, POST a backend e naviga su lista pazienti dopo successo
   */
  accettaPaziente(pz: CreazionePaziente): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post<HttpRes>(`${this.URL}/accetta-pz`, pz).pipe(
        retry(3)
      ).subscribe({
        next: (data) => {
          if (data.state === 'KO') {
            reject(data.error);
          } else {
            // Naviga alla lista pazienti dopo inserimento
            this.router.navigate(['/lista-pz']).then(() => {
              resolve();
            });
          }
        },
        error: (err) => reject(err)
      });
    });
  }

  /**
   * Trasferisce un paziente via PUT e aggiorna lista dopo
   */
  traferisciPaziente(idPaziente: number): void {
    this.http.put<HttpRes>(`${this.URL}/trasferisci-pz/${idPaziente}`, {}).pipe(
      retry(3),
      finalize(() => this.getListaPazienti())
    ).subscribe({
      next: res => {
        if (res.state === 'KO') {
          console.error('Errore trasferimento paziente', res.error);
        }
      },
      error: err => console.error('Errore HTTP trasferisci paziente', err)
    });
  }

  /**
   * Dimette un paziente via DELETE e aggiorna lista dopo
   */
  dimettiPaziente(idPaziente: number): void {
    this.http.delete<HttpRes>(`${this.URL}/dimetti-pz/${idPaziente}`, {}).pipe(
      retry(3),
      finalize(() => this.getListaPazienti())
    ).subscribe({
      next: res => {
        if (res.state === 'KO') {
          console.error('Errore dimissione paziente', res.error);
        }
      },
      error: err => console.error('Errore HTTP dimetti paziente', err)
    });
  }
}
