import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { StudentRecord, StudentRecordForm } from '../models/student-record.model'

const PATH = 'attention-tracking';

@Injectable({
  providedIn: 'root'
})
export class AttentionTrackingService {

  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, PATH);

  searchByQuery(name: string, userId: string) {
    const q = query(
      this._collection, 
      where('userId', '==', userId),
      where('nombres', '>=', name), 
      where('nombres', '<=', name + '\uf8ff'),
    );
    
    return collectionData(q, { idField: 'id' }) as Observable<StudentRecord[]>;
  }

  createAttentionTracking(attentionTracking: 
    StudentRecordForm) {
    return addDoc(this._collection, attentionTracking);
  }

  updateAttentionTracking(id: string, studentRecord: StudentRecordForm) {
    try {
      const document = doc(this._firestore, PATH, id);
      return updateDoc(document, { ...studentRecord });
    } catch (error) {
      console.error('Error updating document:', error);
      return undefined;
    }
  }

  getAllAttentionTracking(userId: string) {

    const q = query(this._collection, where('userId', '==', userId));

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

}
