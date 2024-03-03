import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, distinctUntilChanged, map, reduce } from 'rxjs';
import { StudentRecord } from '../models/student-record.model';
import { CITY_PATH, COUNTRY_PATH, EPS_PATH, GENDER_PATH, GRADES_PATH, NEIGHBORHOOD_PATH } from './attention-tracking.service';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteDataService {

  private _firestore = inject(Firestore);

  getEpsData(userId: string): Observable<string[]> {
    const collectionRef = collection(this._firestore, EPS_PATH);
    const q = query(
      collectionRef,
      where('userId', '==', userId),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((data: {valor: string}[]) => data.map((record) => record.valor.toLowerCase().trim())),
    );
  }

  getNeighborhoodData(userId: string): Observable<string[]> {
    const collectionRef = collection(this._firestore, NEIGHBORHOOD_PATH);
    const q = query(
      collectionRef,
      where('userId', '==', userId),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((data: {valor: string}[]) => data.map((record) => record.valor.toLowerCase().trim())),
    );
  }

  getGradesData(userId: string): Observable<string[]> {
    const collectionRef = collection(this._firestore, GRADES_PATH);
    const q = query(
      collectionRef,
      where('userId', '==', userId),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((data: {valor: string}[]) => data.map((record) => record.valor.toLowerCase().trim())),
    );
  }

  getGendersData(userId: string): Observable<string[]> {
    const collectionRef = collection(this._firestore, GENDER_PATH);
    const q = query(
      collectionRef,
      where('userId', '==', userId),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((data: {valor: string}[]) => data.map((record) => record.valor.toLowerCase().trim())),
    );
  }

  getCountryData(userId: string): Observable<string[]> {
    const collectionRef = collection(this._firestore, COUNTRY_PATH);
    const q = query(
      collectionRef,
      where('userId', '==', userId),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((data: {valor: string}[]) => data.map((record) => record.valor.toLowerCase().trim())),
    );
  }

  getCitiesData(userId: string): Observable<string[]> {
    const collectionRef = collection(this._firestore, CITY_PATH);
    const q = query(
      collectionRef,
      where('userId', '==', userId),
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((data: {valor: string}[]) => data.map((record) => record.valor.toLowerCase().trim())),
    );
  }

}
