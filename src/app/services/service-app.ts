import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceAppService {
  constructor(private httpClient: HttpClient) {}

  getPositions() {
      return this.httpClient.get(`${environment.positions}`);
  }
}
