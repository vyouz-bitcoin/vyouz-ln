import { Injectable } from '@nestjs/common';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { readFile } from 'fs/promises';
import { getRandomNumber } from 'src/common/utils/getRandomNumber';
// import { join } from 'path';
import { db } from 'src/firebase.config';

@Injectable()
export class FirebaseService {
  async getImageFromFirebase(name: string) {
    try {
      const q = query(
        collection(db, 'vyouz'),
        where('features', 'array-contains', name),
      );
      const querySnapshot = await getDocs(q);

      const array = [];
      querySnapshot.forEach((doc) => {
        array.push(doc.data());
      });
      return array;
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  }

  async uploadImageToFirebase(file, filename) {
    try {
      const fileBuffer = await readFile(file);
      const storage = getStorage();
      const storageRef = ref(
        storage,
        'vyouz/' + filename + '_' + getRandomNumber() + '.png',
      );
      const snapshot = await uploadBytes(storageRef, fileBuffer);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw Error('Error getting download URL');
    }
  }
}
