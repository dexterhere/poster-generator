import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { PosterDraft } from '../utils/draft';

const DB_NAME = 'PosterGenDB';
const DB_VERSION = 1;

interface PosterGenDB extends DBSchema {
  sessions: {
    key: string;
    value: {
      posterId: string;
      data: PosterDraft;
      updatedAt: number;
    };
  };
  images: {
    key: string;
    value: {
      imageId: string;
      blob: Blob;
      mimeType: string;
      size: number;
      createdAt: number;
    };
  };
  snapshots: {
    key: number;
    value: {
      timestamp: number;
      posterId: string;
      data: PosterDraft;
      label?: string;
    };
    indexes: { posterId: string };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

let dbPromise: Promise<IDBPDatabase<PosterGenDB>> | null = null;

function getDB(): Promise<IDBPDatabase<PosterGenDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PosterGenDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'posterId' });
        }
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images', { keyPath: 'imageId' });
        }
        if (!db.objectStoreNames.contains('snapshots')) {
          const snapshotStore = db.createObjectStore('snapshots', {
            keyPath: 'timestamp',
          });
          snapshotStore.createIndex('posterId', 'posterId', { unique: false });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// ─── Sessions ───────────────────────────────────────────────────────────────

export async function saveSession(
  posterId: string,
  data: PosterDraft
): Promise<void> {
  const db = await getDB();
  await db.put('sessions', {
    posterId,
    data,
    updatedAt: Date.now(),
  });
}

export async function loadSession(
  posterId: string
): Promise<PosterDraft | null> {
  const db = await getDB();
  const record = await db.get('sessions', posterId);
  return record?.data ?? null;
}

export async function getAllSessions(): Promise<
  { posterId: string; updatedAt: number }[]
> {
  const db = await getDB();
  const records = await db.getAll('sessions');
  return records.map((r) => ({ posterId: r.posterId, updatedAt: r.updatedAt }));
}

export async function deleteSession(posterId: string): Promise<void> {
  const db = await getDB();
  await db.delete('sessions', posterId);
}

// ─── Images ─────────────────────────────────────────────────────────────────

export async function saveImage(
  imageId: string,
  blob: Blob,
  mimeType: string
): Promise<void> {
  const db = await getDB();
  await db.put('images', {
    imageId,
    blob,
    mimeType,
    size: blob.size,
    createdAt: Date.now(),
  });
}

export async function loadImage(imageId: string): Promise<Blob | null> {
  const db = await getDB();
  const record = await db.get('images', imageId);
  return record?.blob ?? null;
}

export async function deleteImage(imageId: string): Promise<void> {
  const db = await getDB();
  await db.delete('images', imageId);
}

export async function getImageUrl(imageId: string): Promise<string | null> {
  const blob = await loadImage(imageId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export async function cleanupOrphanedImages(
  referencedIds: Set<string>
): Promise<void> {
  const db = await getDB();
  const allImages = await db.getAllKeys('images');
  for (const id of allImages) {
    if (!referencedIds.has(id)) {
      await db.delete('images', id);
    }
  }
}

// ─── Snapshots (history) ────────────────────────────────────────────────────

export async function saveSnapshot(
  posterId: string,
  data: PosterDraft,
  label?: string
): Promise<void> {
  const db = await getDB();
  await db.put('snapshots', {
    timestamp: Date.now(),
    posterId,
    data,
    label,
  });
  // Keep only last 20 snapshots per poster
  const allSnapshots = await db.getAll('snapshots');
  const posterSnapshots = allSnapshots.filter((s) => s.posterId === posterId);
  if (posterSnapshots.length > 20) {
    const toDelete = posterSnapshots.slice(0, posterSnapshots.length - 20);
    const tx = db.transaction('snapshots', 'readwrite');
    for (const s of toDelete) {
      await tx.store.delete(s.timestamp);
    }
    await tx.done;
  }
}

export async function getSnapshots(
  posterId: string
): Promise<{ timestamp: number; label?: string }[]> {
  const db = await getDB();
  const allSnapshots = await db.getAll('snapshots');
  return allSnapshots
    .filter((s) => s.posterId === posterId)
    .map((s) => ({ timestamp: s.timestamp, label: s.label }));
}

export async function loadSnapshot(
  timestamp: number
): Promise<PosterDraft | null> {
  const db = await getDB();
  const record = await db.get('snapshots', timestamp);
  return record?.data ?? null;
}

// ─── Settings ───────────────────────────────────────────────────────────────

export async function saveSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB();
  await db.put('settings', value, key);
}

export async function loadSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB();
  return db.get('settings', key) as Promise<T | undefined>;
}

// ─── Session Recovery ───────────────────────────────────────────────────────

export async function getMostRecentSession(): Promise<{
  posterId: string;
  data: PosterDraft;
  updatedAt: number;
} | null> {
  const sessions = await getAllSessions();
  if (sessions.length === 0) return null;
  const mostRecent = sessions.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const db = await getDB();
  const record = await db.get('sessions', mostRecent.posterId);
  return record ?? null;
}
