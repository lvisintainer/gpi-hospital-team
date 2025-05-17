import { Component, inject, OnInit } from '@angular/core';
import { AFPHospitalAPIService } from '../../core/services/afphospital-api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-pz',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-pz.component.html',
  styleUrl: './lista-pz.component.scss'
})
export class ListaPzComponent implements OnInit {
  constructor(public api: AFPHospitalAPIService) {}

ngOnInit(): void {
  this.api.getListaPazienti();
}


  trackById(index: number, item: { id_paziente: number }): number {
  return item.id_paziente;
}

}
