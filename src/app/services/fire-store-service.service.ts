import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Employee } from '../models/Employee';

@Injectable({
  providedIn: 'root',
})
export class FireStoreServiceService {
  constructor(
    private firestore: AngularFirestore
  ) {}

  createEmployee(employee: Employee) {
    const data = employee;
    delete data.id;
    return this.firestore.collection('employees').add(data);
  }

  getEmployees() {
    return this.firestore.collection('employees').snapshotChanges();
  }

  updateEmployee(employee: Employee) {
    const id: string = employee.id;
    delete employee.id;
    return this.firestore.collection('employees').doc(id).set(employee);
  }

  deleteEmployee(id: string) {
    return this.firestore.collection('employees').doc(id).delete();
  }
}
