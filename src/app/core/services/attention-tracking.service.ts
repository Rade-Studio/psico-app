import { Injectable, inject } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, startAfter, updateDoc, where } from '@angular/fire/firestore';
import { Observable, map, timeInterval } from 'rxjs';
import { StudentRecord, StudentRecordForm } from '../models/student-record.model'
import { Tracking, TrackingForm } from '../models/tracking.model';

const PATH = 'attention-tracking';
export const CITY_PATH = 'cities';
export const COUNTRY_PATH = 'countries';
export const EPS_PATH = 'eps';
export const NEIGHBORHOOD_PATH = 'neighborhoods'
export const GRADES_PATH = 'grades';
export const GENDER_PATH = 'genders';
export const TRACKINGPATH = 'tracking';

@Injectable({
  providedIn: 'root'
})
export class AttentionTrackingService {

  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, PATH);

  searchByQuery(name: string, userId: string) {
    const searchTokens = this.generateSearchTokens(name);
    const q = query(
      this._collection, 
      where('userId', '==', userId),
      where('eliminado', '==', false),
      where('reverseSearchTokens', 'array-contains-any', searchTokens),
      orderBy('nombres', 'asc'),
      limit(20),
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<StudentRecord[]>;
  }

  createAttentionTracking(attentionTracking: 
    StudentRecordForm) {
      attentionTracking.reverseSearchTokens = this.generateReverseSearchTokens(attentionTracking.nombres);
      this.saveAllIfNoExists(attentionTracking);
      return addDoc(this._collection, attentionTracking);
  }

  async createManyAttentionTracking(attentionTracking: any[]) {
    attentionTracking.forEach(element => {
      this.saveAllIfNoExists(element);
      return addDoc(this._collection, element);
    });
  }

  updateAttentionTracking(id: string, studentRecord: StudentRecordForm) {
    try {
      const document = doc(this._firestore, PATH, id);
      studentRecord.reverseSearchTokens = this.generateReverseSearchTokens(studentRecord.nombres);
      this.saveAllIfNoExists(studentRecord);
      return updateDoc(document, { ...studentRecord });
    } catch (error) {
      console.error('Error updating document:', error);
      return undefined;
    }
  }

  getAllAttentionTracking(userId: string, lastAttentionTracking?: StudentRecord) {

    let q;

    if (lastAttentionTracking) {
      console.log(lastAttentionTracking);
      q = query(
        this._collection, 
        where('userId', '==', userId),
        where('eliminado', '==', false),
        orderBy('nombres', 'asc'),
        startAfter(lastAttentionTracking.nombres),
        limit(10)
      );
    } else {
      q = query(
        this._collection, 
        where('userId', '==', userId),
        where('eliminado', '==', false),
        orderBy('nombres', 'asc'),
        limit(10)
      );
    }

    return collectionData(q, { idField: 'id' }) as Observable<StudentRecord[]>;
  }

  async getAttentionTrackingById(id: string) {
    try {
      const document = doc(this._firestore, PATH, id);
      const snapshot = await getDoc(document);

      return snapshot.data() as StudentRecord;
    } catch (error) {
      console.error('Error getting document:', error);
      return undefined;
    }
  }

  async deleteAttentionTracking(id: string) {
    try {
      const document = doc(this._firestore, PATH, id);
      // return deleteDoc(document);
      return await updateDoc(document, { eliminado: true });
    } catch (error) {
      console.error('Error updating document:', error);
      return undefined;
    }
  }

  getAllTracking(attentionTrackingId: string) {
    const q = query(
      collection(this._firestore, PATH, attentionTrackingId, TRACKINGPATH),
      where('eliminado', '==', false),
      orderBy('fechaIngreso', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((trackings: Tracking[]) => {
        return trackings.map((tracking: Tracking) => {
          return {
            ...tracking,
            fechaIngreso: (tracking.fechaIngreso as Timestamp)
              .toDate()
              .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          };
        });
      })
    ) as Observable<Tracking[]>;
  }

  async getTrackingById(attentionTrackingId: string, trackingId: string) {
    try {
      const document = doc(this._firestore, PATH, attentionTrackingId, TRACKINGPATH, trackingId);
      var snapshot = await getDoc(document);

      return snapshot.data() as Tracking;
    } catch (error) {
      console.error('Error getting document:', error);
      return undefined;
    }
  }

  createTracking(attentionTrackingId: string, tracking: TrackingForm) {
    return addDoc(collection(this._firestore, PATH, attentionTrackingId, TRACKINGPATH), tracking);
  }

  updateTracking(attentionTrackingId: string, trackingId: string, tracking: TrackingForm) {
    try {
      const document = doc(this._firestore, PATH, attentionTrackingId, TRACKINGPATH, trackingId);
      return updateDoc(document, { ...tracking });
    } catch (error) {
      console.error('Error updating document:', error);
      return undefined;
    }
  }

  async deleteTracking(attentionTrackingId: string, trackingId: string) {
    try {
      const document = doc(this._firestore, PATH, attentionTrackingId, TRACKINGPATH, trackingId);
      return await updateDoc(document, { eliminado: true });
    } catch (error) {
      console.error('Error updating document:', error);
      return undefined;
    }
  }

  public generateReverseSearchTokens(texto: string): string[] {
    const words = texto.toLowerCase().split(' ');
    const tokens: string[] = [];

    words.forEach(palabra => {
      tokens.push(palabra);
    });

    for (let i = 0; i < words.length; i++) {
      const token = words.slice(i).join(' ');
      tokens.push(token);
    }
    return tokens;
  }

  private generateSearchTokens(searchText: string): string[] {
    // Separar el texto de búsqueda en palabras
    const words = searchText.toLowerCase().split(' ');
    
    // Generar tokens de búsqueda inversa
    const searchTokens: string[] = [];
    for (let i = 0; i < words.length; i++) {
      const token = words.slice(i).join(' ');
      searchTokens.push(token);
    }
    
    return searchTokens;
  }

  async saveAllIfNoExists(record: StudentRecordForm) {
    await this.saveIfNotExists(CITY_PATH, { valor: record.ciudadOrigen.toLowerCase().trim(), userId: record.userId });
    await this.saveIfNotExists(COUNTRY_PATH, { valor: record.paisOrigen.toLowerCase().trim(), userId: record.userId });
    await this.saveIfNotExists(EPS_PATH, { valor: record.eps.toLowerCase().trim(), userId: record.userId });
    await this.saveIfNotExists(NEIGHBORHOOD_PATH, { valor: record.barrio.toLowerCase().trim(), userId: record.userId });
    await this.saveIfNotExists(GRADES_PATH, { valor: record.grado.toLowerCase().trim(), userId: record.userId });
    await this.saveIfNotExists(GENDER_PATH, { valor: record.sexo.toLowerCase().trim(), userId: record.userId });
  }

  async deleteAllIfExists(record: StudentRecordForm) {
    await this.deleteIfExists(CITY_PATH, { valor: record.ciudadOrigen.toLowerCase(), userId: record.userId });
    await this.deleteIfExists(COUNTRY_PATH, { valor: record.paisOrigen.toLowerCase(), userId: record.userId });
    await this.deleteIfExists(EPS_PATH, { valor: record.eps.toLowerCase(), userId: record.userId });
    await this.deleteIfExists(NEIGHBORHOOD_PATH, { valor: record.barrio.toLowerCase(), userId: record.userId });
    await this.deleteIfExists(GRADES_PATH, { valor: record.grado.toLowerCase(), userId: record.userId });
    await this.deleteIfExists(GENDER_PATH, { valor: record.sexo.toLowerCase(), userId: record.userId });
  }
  

  // Guardar generico si no existe en la coleccion
  async saveIfNotExists(collectionPath: string, data: { valor: string, userId: string }) {
    const q = query(
      collection(this._firestore, collectionPath),
      where('valor', '==', data.valor),
      where('userId', '==', data.userId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      addDoc(collection(this._firestore, collectionPath), data);
    }
  }

  async deleteIfExists(collectionPath: string, data: { valor: string, userId: string }) {
    const q = query(
      collection(this._firestore, collectionPath),
      where('valor', '==', data.valor),
      where('userId', '==', data.userId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }
  }

}
