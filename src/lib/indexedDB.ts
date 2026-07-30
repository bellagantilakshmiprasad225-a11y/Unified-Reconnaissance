import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'UnifiedReconOSINT_DB';
const DB_VERSION = 1;
const EVIDENCE_STORE = 'evidence_files';
const AVATAR_STORE = 'target_avatars';

export interface StoredFile {
  id: string;
  blob: Blob;
  fileName: string;
  fileType: string;
  createdAt: string;
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(EVIDENCE_STORE)) {
          db.createObjectStore(EVIDENCE_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(AVATAR_STORE)) {
          db.createObjectStore(AVATAR_STORE, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export const saveEvidenceFile = async (id: string, file: File | Blob, fileName: string, fileType: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.put(EVIDENCE_STORE, {
      id,
      blob: file,
      fileName,
      fileType,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('IndexedDB save file error:', error);
  }
};

export const getEvidenceFile = async (id: string): Promise<StoredFile | undefined> => {
  try {
    const db = await getDB();
    return await db.get(EVIDENCE_STORE, id);
  } catch (error) {
    console.error('IndexedDB get file error:', error);
    return undefined;
  }
};

export const deleteEvidenceFile = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete(EVIDENCE_STORE, id);
  } catch (error) {
    console.error('IndexedDB delete file error:', error);
  }
};

export const saveTargetAvatar = async (id: string, imageBlob: Blob): Promise<void> => {
  try {
    const db = await getDB();
    await db.put(AVATAR_STORE, { id, blob: imageBlob, createdAt: new Date().toISOString() });
  } catch (error) {
    console.error('IndexedDB save avatar error:', error);
  }
};

export const getTargetAvatar = async (id: string): Promise<Blob | undefined> => {
  try {
    const db = await getDB();
    const res = await db.get(AVATAR_STORE, id);
    return res?.blob;
  } catch (error) {
    console.error('IndexedDB get avatar error:', error);
    return undefined;
  }
};

export const clearAllIndexedDB = async (): Promise<void> => {
  try {
    const db = await getDB();
    await db.clear(EVIDENCE_STORE);
    await db.clear(AVATAR_STORE);
  } catch (error) {
    console.error('Error clearing IndexedDB:', error);
  }
};
