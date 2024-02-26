import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable, distinctUntilChanged, map, reduce } from 'rxjs';
import { StudentRecord } from '../models/student-record.model';


const PATH = 'attention-tracking';

@Injectable({
  providedIn: 'root'
})
export class AutocompleteDataService {

  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, PATH);

  getEpsData(): Observable<string[]> {
    return collectionData(this._collection, { idField: 'id' }).pipe(
      map((data: StudentRecord[]) => data.map((record) => record.eps.toLowerCase().trim())),
      map((data: string[]) => data.filter((value, index, self) => self.indexOf(value) === index)),
    );
  }

  getCityData(): Observable<string[]> {
    return collectionData(this._collection, { idField: 'id' }).pipe(
      map((data: StudentRecord[]) => data.map((record) => record.ciudadOrigen.toLowerCase().trim())),
      map((data: string[]) => data.filter((value, index, self) => self.indexOf(value) === index)),
    )
  }

  getCountryData(): Observable<string[]> {
    return collectionData(this._collection, { idField: 'id' }).pipe(
      map((data: StudentRecord[]) => data.map((record) => record.paisOrigen.toLowerCase().trim())),
      map((data: string[]) => data.filter((value, index, self) => self.indexOf(value) === index)),
    )
  }

  getNeighborhoodData(): Observable<string[]> {
    return collectionData(this._collection, { idField: 'id' }).pipe(
      map((data: StudentRecord[]) => data.map((record) => record.barrio.toLowerCase().trim())),
      map((data: string[]) => data.filter((value, index, self) => self.indexOf(value) === index)),
    )
  }

  getGenderData(): Observable<string[]> {
    return collectionData(this._collection, { idField: 'id' }).pipe(
      map((data: StudentRecord[]) => data.map((record) => record.sexo.toLowerCase().trim())),
      map((data: string[]) => data.filter((value, index, self) => self.indexOf(value) === index)),
    )
  }

  getGradeData(): Observable<string[]> {
    return collectionData(this._collection, { idField: 'id' }).pipe(
      map((data: StudentRecord[]) => data.map((record) => record.grado.toLowerCase().trim())),
      map((data: string[]) => data.filter((value, index, self) => self.indexOf(value) === index)),
    )
  }

  getNamesData(userId: string): Observable<string[]> {
    const q = query(
      this._collection, 
      where('userId', '==', userId)
    );

    return collectionData(this._collection, { idField: 'id' }).pipe(
      map((data: StudentRecord[]) => data.map((record) => record.nombres.toLowerCase().trim())),
      map((data: string[]) => data.filter((value, index, self) => self.indexOf(value) === index)),
    )
  }

}
