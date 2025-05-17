export interface Paziente {
  id_paziente: number;
  codice: string;
  codice_colore: CodiceColore;
  stato: StatoPZ;
  id_reparto: number;
  nome_reparto: string;
  descrizione: string;
  id_anagrafica: number;
  nome: string;
  cognome: string;
  data_nascita: Date;
  codice_fiscale: string;
}

export interface CreazionePaziente {
  codice: string;
  codiceColore: CodiceColore;
  cognome: string;
  dataNascita: Date;
  nome: string;
  codiceFiscale: string;
  stato: StatoPZ;
}

export type CodiceColore = 'NON FORNITO' | 'BIANCO' | 'VERDE' | 'AZZURRO' | 'ARANCIONE' | 'ROSSO';
export type StatoPZ = 'IN CARICO' | 'DIMESSO' | 'TRASFERITO';
