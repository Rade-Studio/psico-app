import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { StudentRecord } from '../models/student-record.model';

const PATH = 'attention-tracking';

@Injectable({
  providedIn: 'root'
})
export class AttentionTrackingService {

  private _firestore = inject(Firestore);

  private _collection = collection(this._firestore, PATH);

  getAllAttentionTracking() {
    return collectionData(this._collection) as Observable<StudentRecord[]>;
  }

}
