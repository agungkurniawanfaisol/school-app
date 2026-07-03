const DB_NAME = 'nurul-hikmah-offline'
const DB_VERSION = 1
const STORE_NAME = 'api-cache'

interface CachedEntry<T = unknown> {
  key: string
  data: T
  timestamp: number
  expiresAt: number
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' })
        store.createIndex('expiresAt', 'expiresAt', { unique: false })
      }
    }
  })
}

export async function setOfflineData<T>(key: string, data: T, ttlMs = 24 * 60 * 60 * 1000): Promise<void> {
  const db = await openDatabase()
  const entry: CachedEntry<T> = {
    key,
    data,
    timestamp: Date.now(),
    expiresAt: Date.now() + ttlMs,
  }

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE_NAME).put(entry)
  })
}

export async function getOfflineData<T>(key: string): Promise<T | null> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    tx.onerror = () => reject(tx.error)
    const request = tx.objectStore(STORE_NAME).get(key)

    request.onsuccess = () => {
      const entry = request.result as CachedEntry<T> | undefined
      if (!entry) {
        resolve(null)
        return
      }
      if (entry.expiresAt < Date.now()) {
        void deleteOfflineData(key)
        resolve(null)
        return
      }
      resolve(entry.data)
    }
  })
}

export async function deleteOfflineData(key: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE_NAME).delete(key)
  })
}

export async function clearExpiredOfflineData(): Promise<void> {
  const db = await openDatabase()
  const now = Date.now()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.onerror = () => reject(tx.error)
    const store = tx.objectStore(STORE_NAME)
    const index = store.index('expiresAt')
    const request = index.openCursor(IDBKeyRange.upperBound(now))

    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      } else {
        resolve()
      }
    }
  })
}

export async function clearAllOfflineData(): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.objectStore(STORE_NAME).clear()
  })
}
