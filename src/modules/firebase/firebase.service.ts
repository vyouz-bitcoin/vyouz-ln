import { Injectable } from '@nestjs/common';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from 'src/firebase.config';

@Injectable()
export class FirebaseService {
  async getImageFromFirebase(name: String) {
    try {
      const q = query(
        collection(db, 'vyouz'),
        where('features', 'array-contains', name),
      );
      const querySnapshot = await getDocs(q);

      let array = [];
      querySnapshot.forEach((doc) => {
        array.push(doc.data());
      });
      return array;
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  }
}
