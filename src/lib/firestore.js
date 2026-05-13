import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Lấy tất cả documents trong collection
export async function getDocuments(collectionName, orderByField = "createdAt", orderDirection = "desc") {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, orderDirection)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents:", error);
    return [];
  }
}

// Lấy documents có điều kiện
export async function getActiveDocuments(collectionName, orderByField = "order", orderDirection = "asc") {
  try {
    const q = query(
      collection(db, collectionName),
      where("isActive", "==", true),
      orderBy(orderByField, orderDirection)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting active documents:", error);
    return [];
  }
}

// Lấy 1 document
export async function getDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

// Thêm document mới
export async function addDocument(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

// Cập nhật document
export async function updateDocument(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

// Xóa document
export async function deleteDocument(collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}

// Realtime listener
export function subscribeToCollection(collectionName, callback, orderByField = "createdAt", orderDirection = "desc") {
  const q = query(
    collection(db, collectionName),
    orderBy(orderByField, orderDirection)
  );
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(docs);
  });
}

// Realtime listener cho active items
export function subscribeToActiveCollection(collectionName, callback, orderByField = "order", orderDirection = "asc") {
  const q = query(
    collection(db, collectionName),
    where("isActive", "==", true),
    orderBy(orderByField, orderDirection)
  );
  return onSnapshot(q, (snapshot) => {
    const docs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(docs);
  });
}
