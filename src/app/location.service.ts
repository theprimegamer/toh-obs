import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Location } from './location';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private locationsUrl = 'api/locations'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** GET locations from the server */
  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.locationsUrl).pipe(
      tap((x) => this.log('fetched locations')),
      catchError(this.handleError<Location[]>('getLocations', []))
    );
  }

  /** GET location by id. Return `undefined` when id not found */
  getLocationNo404<Data>(id: number): Observable<Location> {
    const url = `${this.locationsUrl}/?id=${id}`;
    return this.http.get<Location[]>(url).pipe(
      map((locations) => locations[0]), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} location id=${id}`);
      }),
      catchError(this.handleError<Location>(`getLocation id=${id}`))
    );
  }

  /** GET location by id. Will 404 if id not found */
  getLocation(id: number): Observable<Location> {
    const url = `${this.locationsUrl}/${id}`;
    return this.http.get<Location>(url).pipe(
      tap((_) => this.log(`fetched location id=${id}`)),
      catchError(this.handleError<Location>(`getLocation id=${id}`))
    );
  }

  /* GET locations whose name contains search term */
  searchLocations(term: string): Observable<Location[]> {
    if (!term.trim()) {
      // if not search term, return empty location array.
      return of([]);
    }
    return this.http.get<Location[]>(`${this.locationsUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found locations matching "${term}"`)
          : this.log(`no locations matching "${term}"`)
      ),
      catchError(this.handleError<Location[]>('searchLocations', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new location to the server */
  addLocation(location: Location): Observable<Location> {
    return this.http
      .post<Location>(this.locationsUrl, location, this.httpOptions)
      .pipe(
        tap((newLocation: Location) =>
          this.log(`added location w/ id=${newLocation.id}`)
        ),
        catchError(this.handleError<Location>('addLocation'))
      );
  }

  /** DELETE: delete the location from the server */
  deleteLocation(id: number): Observable<Location> {
    const url = `${this.locationsUrl}/${id}`;

    return this.http.delete<Location>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted location id=${id}`)),
      catchError(this.handleError<Location>('deleteLocation'))
    );
  }

  /** PUT: update the location on the server */
  updateLocation(location: Location): Observable<any> {
    return this.http.put(this.locationsUrl, location, this.httpOptions).pipe(
      tap((_) => this.log(`updated location id=${location.id}`)),
      catchError(this.handleError<any>('updateLocation'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a LocationService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`LocationService: ${message}`);
  }
}
