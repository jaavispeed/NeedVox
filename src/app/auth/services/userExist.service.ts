import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  constructor(private firestore: Firestore) {}


}
