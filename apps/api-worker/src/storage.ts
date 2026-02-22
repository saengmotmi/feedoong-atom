import * as R from "remeda";

import type { ParsedFeedItem, SyncRepository } from "@feedoong/sync-core";

import type { Bindings, SourceRow, StorageRef, StorageShape } from "./types";

const STORAGE_KEY = "feedoong.storage.v1";

const createInitialStorage = (): StorageShape => ({
  nextSourceId: 1,
  nextItemId: 1,
  sources: [],
  items: []
});

export const readStorage = async (env: Bindings): Promise<StorageShape> => {
  const loaded = await env.FEEDOONG_DB.get<StorageShape>(STORAGE_KEY, "json");
  return loaded ?? createInitialStorage();
};

export const writeStorage = async (env: Bindings, storage: StorageShape) => {
  await env.FEEDOONG_DB.put(STORAGE_KEY, JSON.stringify(storage));
};

export const createStorageRef = (storage: StorageShape): StorageRef => ({
  current: storage
});

export const listSources = (storage: StorageShape): SourceRow[] =>
  [...storage.sources].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export const listItems = (storage: StorageShape, limit: number, offset: number) =>
  [...storage.items]
    .sort((a, b) => {
      const left = a.publishedAt ?? a.createdAt;
      const right = b.publishedAt ?? b.createdAt;
      return left < right ? 1 : -1;
    })
    .slice(offset, offset + limit);

export const getSourceById = (storage: StorageShape, sourceId: number) =>
  storage.sources.find((source) => source.id === sourceId) ?? null;

export const addSource = (
  storage: StorageShape,
  url: string,
  title: string,
  now: () => string = () => new Date().toISOString()
): { storage: StorageShape; source: SourceRow } => {
  const isDuplicate = storage.sources.some((source) => source.url === url);
  if (isDuplicate) {
    throw new Error("DUPLICATE_SOURCE_URL");
  }

  const source: SourceRow = {
    id: storage.nextSourceId,
    url,
    title,
    lastSyncedAt: null,
    lastCheckedAt: null,
    lastHeadEtag: null,
    lastHeadLastModified: null,
    createdAt: now()
  };

  return {
    source,
    storage: {
      ...storage,
      nextSourceId: storage.nextSourceId + 1,
      sources: [...storage.sources, source]
    }
  };
};

export const updateSourceMetadata = (
  storage: StorageShape,
  sourceId: number,
  title: string,
  syncedAt: string,
  checkMetadata?: {
    checkedAt?: string | null;
    headEtag?: string | null;
    headLastModified?: string | null;
  }
): StorageShape => {
  const sources = R.map(storage.sources, (source) => {
    if (source.id !== sourceId) {
      return source;
    }

    const next: SourceRow = {
      ...source,
      title,
      lastSyncedAt: syncedAt
    };

    if (checkMetadata) {
      if ("checkedAt" in checkMetadata) {
        next.lastCheckedAt = checkMetadata.checkedAt ?? null;
      }
      if ("headEtag" in checkMetadata) {
        next.lastHeadEtag = checkMetadata.headEtag ?? null;
      }
      if ("headLastModified" in checkMetadata) {
        next.lastHeadLastModified = checkMetadata.headLastModified ?? null;
      }
    }

    return next;
  });

  const items = R.map(storage.items, (item) =>
    item.sourceId === sourceId
      ? {
          ...item,
          sourceTitle: title
        }
      : item
  );

  return {
    ...storage,
    sources,
    items
  };
};

export const updateSourceCheckMetadata = (
  storage: StorageShape,
  sourceId: number,
  checkedAt: string,
  headEtag: string | null,
  headLastModified: string | null
): StorageShape => ({
  ...storage,
  sources: R.map(storage.sources, (source) =>
    source.id === sourceId
      ? {
          ...source,
          lastCheckedAt: checkedAt,
          lastHeadEtag: headEtag,
          lastHeadLastModified: headLastModified
        }
      : source
  )
});

const sourceScopedItemExists = (
  existingItems: StorageShape["items"],
  sourceId: number,
  item: ParsedFeedItem
) =>
  existingItems.some(
    (existing) =>
      existing.link === item.link ||
      (existing.sourceId === sourceId && existing.guid === item.guid)
  );

export const insertItems = (
  storage: StorageShape,
  sourceId: number,
  items: ParsedFeedItem[],
  now: () => string = () => new Date().toISOString()
): { storage: StorageShape; insertedCount: number } => {
  const source = getSourceById(storage, sourceId);
  if (!source) {
    return {
      storage,
      insertedCount: 0
    };
  }

  const reduced = R.reduce(
    items,
    (accumulator, item) => {
      if (sourceScopedItemExists(accumulator.items, sourceId, item)) {
        return accumulator;
      }

      const nextItem = {
        id: accumulator.nextItemId,
        sourceId,
        sourceTitle: source.title,
        guid: item.guid,
        title: item.title,
        link: item.link,
        summary: item.summary,
        publishedAt: item.publishedAt,
        createdAt: now()
      };

      return {
        nextItemId: accumulator.nextItemId + 1,
        insertedCount: accumulator.insertedCount + 1,
        items: [...accumulator.items, nextItem]
      };
    },
    {
      nextItemId: storage.nextItemId,
      insertedCount: 0,
      items: storage.items
    }
  );

  return {
    insertedCount: reduced.insertedCount,
    storage: {
      ...storage,
      nextItemId: reduced.nextItemId,
      items: reduced.items
    }
  };
};

export const createRepository = (storageRef: StorageRef): SyncRepository => ({
  getSourceById: (sourceId) => getSourceById(storageRef.current, sourceId),
  listSources: () => [...storageRef.current.sources],
  insertItems: (sourceId, items) => {
    const next = insertItems(storageRef.current, sourceId, items);
    storageRef.current = next.storage;
    return next.insertedCount;
  },
  updateSourceMetadata: (sourceId, title, syncedAt, checkMetadata) => {
    storageRef.current = updateSourceMetadata(
      storageRef.current,
      sourceId,
      title,
      syncedAt,
      checkMetadata
    );
  },
  updateSourceCheckMetadata: (sourceId, checkedAt, headEtag, headLastModified) => {
    storageRef.current = updateSourceCheckMetadata(
      storageRef.current,
      sourceId,
      checkedAt,
      headEtag,
      headLastModified
    );
  }
});
