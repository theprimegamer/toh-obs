import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Power } from './power';
import { MessageService } from './message.service';

@Injectable({ providedIn: 'root' })
export class PowerService {
  private powersUrl = 'api/powers'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /** GET powers from the server */
  getPowers(): Observable<Power[]> {
    return this.http.get<Power[]>(this.powersUrl).pipe(
      tap((x) => this.log('fetched powers')),
      catchError(this.handleError<Power[]>('getPowers', []))
    );
  }

  /** GET power by id. Return `undefined` when id not found */
  getPowerNo404<Data>(id: number): Observable<Power> {
    const url = `${this.powersUrl}/?id=${id}`;
    return this.http.get<Power[]>(url).pipe(
      map((powers) => powers[0]), // returns a {0|1} element array
      tap((h) => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} power id=${id}`);
      }),
      catchError(this.handleError<Power>(`getPower id=${id}`))
    );
  }

  /** GET power by id. Will 404 if id not found */
  getPower(id: number): Observable<Power> {
    const url = `${this.powersUrl}/${id}`;
    return this.http.get<Power>(url).pipe(
      tap((_) => this.log(`fetched power id=${id}`)),
      catchError(this.handleError<Power>(`getPower id=${id}`))
    );
  }

  /* GET powers whose name contains search term */
  searchPowers(term: string): Observable<Power[]> {
    if (!term.trim()) {
      // if not search term, return empty power array.
      return of([]);
    }
    return this.http.get<Power[]>(`${this.powersUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found powers matching "${term}"`)
          : this.log(`no powers matching "${term}"`)
      ),
      catchError(this.handleError<Power[]>('searchPowers', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new power to the server */
  addPower(power: Power): Observable<Power> {
    return this.http
      .post<Power>(this.powersUrl, power, this.httpOptions)
      .pipe(
        tap((newPower: Power) =>
          this.log(`added power w/ id=${newPower.id}`)
        ),
        catchError(this.handleError<Power>('addPower'))
      );
  }

  /** DELETE: delete the power from the server */
  deletePower(id: number): Observable<Power> {
    const url = `${this.powersUrl}/${id}`;

    return this.http.delete<Power>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted power id=${id}`)),
      catchError(this.handleError<Power>('deletePower'))
    );
  }

  /** PUT: update the power on the server */
  updatePower(power: Power): Observable<any> {
    return this.http.put(this.powersUrl, power, this.httpOptions).pipe(
      tap((_) => this.log(`updated power id=${power.id}`)),
      catchError(this.handleError<any>('updatePower'))
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

  /** Log a PowerService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PowerService: ${message}`);
  }
}
