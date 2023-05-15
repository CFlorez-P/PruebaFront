import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { Vehicle } from '../entities/vehicle';
import { VehicleValue } from '../entities/vehicleValue';


@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private url: string = 'https://localhost:7204/Vehicle';

  constructor(private http: HttpClient) { }


  getVehicleData(pageIndex: number, pageSize: number, estacion?: string, fechaDesde?: string, fechaHasta?: string): Observable<Vehicle[]> {
    const url = `${this.url}/GetAllData`;

    const options = {
      headers: new HttpHeaders(),
      observe: 'response' as const,
      params: new HttpParams()
        .set('pageIndex', pageIndex.toString())
        .set('pageSize', pageSize.toString())
    };

    if (estacion) {
        options.params = options.params.set('estacion', estacion);
    }
    if (fechaDesde) {
        options.params = options.params.set('fechaDesde', fechaDesde);
    }
    if (fechaHasta) {
        options.params = options.params.set('fechaHasta', fechaHasta);
    }

    return this.http.get<Vehicle[]>(url, options)
    .pipe(
      map((response: HttpResponse<Vehicle[]>) => {
        if (response.body !== null) {
          return response.body;
        } else {
          throw new Error('Response body is null.');
        }
      }),
      catchError(this.handleError)
    );
}

getStations(): Observable<string[]> {
  const url = `${this.url}/GetAllStations`;

  const options = {
    headers: new HttpHeaders(),
    observe: 'response' as const
  };

  return this.http.get<string[]>(url, options)
    .pipe(
      map((response: HttpResponse<string[]>) => {
        if (response.body !== null) {
          return response.body;
        } else {
          throw new Error('Response body is null.');
        }
      }),
      catchError(this.handleError)
    );
}

getDates(): Observable<string[]> {
  const url = `${this.url}/GetAllDates`;

  const options = {
    headers: new HttpHeaders(),
    observe: 'response' as const
  };

  return this.http.get<string[]>(url, options)
    .pipe(
      map((response: HttpResponse<string[]>) => {
        if (response.body !== null) {
          return response.body;
        } else {
          throw new Error('Response body is null.');
        }
      }),
      catchError(this.handleError)
    );
}

getVehicleValueData(): Observable<VehicleValue[]> {
  const url = `${this.url}/GetVehicleValueData`;

  const options = {
    headers: new HttpHeaders(),
    observe: 'response' as const
  };

  return this.http.get<VehicleValue[]>(url, options)
  .pipe(
    map((response: HttpResponse<VehicleValue[]>) => {
      if (response.body !== null) {
        return response.body;
      } else {
        throw new Error('Response body is null.');
      }
    }),
    catchError(this.handleError)
  );
}


  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
