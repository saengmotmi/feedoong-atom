import fs from "node:fs";
import path from "node:path";

export type SourceRow = {
  id: number;
  url: string;
  title: string;
  lastSyncedAt: string | null;
  lastCheckedAt?: string | null;
  lastHeadEtag?: string | null;
  lastHeadLastModified?: string | null;
  createdAt: string;
};

export type ItemRow = {
  id: number;
  sourceId: number;
  sourceTitle: string;
  guid: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type NewItem = {
  guid: string;
  title: string;
  link: string;
  summary: string | null;
  publishedAt: string | null;
};

type StorageShape = {
  nextSourceId: number;
  nextItemId: number;
  sources: SourceRow[];
  items: ItemRow[];
};

const createInitialStorage = (): StorageShape => ({
  nextSourceId: 1,
  nextItemId: 1,
  sources: [],
  items: []
});

export class FeedoongDb {
  private readonly storagePath: string;

  constructor(storagePath: string) {
    this.storagePath = path.resolve(storagePath);
    fs.mkdirSync(path.dirname(this.storagePath), { recursive: true });
    if (!fs.existsSync(this.storagePath)) {
      this.write(createInitialStorage());
    }
  }

  private read(): StorageShape {
    const raw = fs.readFileSync(this.storagePath, "utf8");
    return JSON.parse(raw) as StorageShape;
  }

  private write(data: StorageShape) {
    fs.writeFileSync(this.storagePath, JSON.stringify(data, null, 2), "utf8");
  }

  listSources(): SourceRow[] {
    const data = this.read();
    return [...data.sources].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  getSourceById(id: number): SourceRow | undefined {
    const data = this.read();
    return data.sources.find((source) => source.id === id);
  }

  addSource(url: string, title: string): SourceRow {
    const data = this.read();
    const isDuplicate = data.sources.some((source) => source.url === url);
    if (isDuplicate) {
      throw new Error("DUPLICATE_SOURCE_URL");
    }

    const source: SourceRow = {
      id: data.nextSourceId,
      url,
      title,
      lastSyncedAt: null,
      lastCheckedAt: null,
      lastHeadEtag: null,
      lastHeadLastModified: null,
      createdAt: new Date().toISOString()
    };

    data.sources.push(source);
    data.nextSourceId += 1;
    this.write(data);
    return source;
  }

  updateSourceMetadata(
    sourceId: number,
    title: string,
    syncedAt: string,
    checkMetadata?: {
      checkedAt?: string | null;
      headEtag?: string | null;
      headLastModified?: string | null;
    }
  ) {
    const data = this.read();
    data.sources = data.sources.map((source) => {
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

    data.items = data.items.map((item) => {
      if (item.sourceId !== sourceId) {
        return item;
      }
      return {
        ...item,
        sourceTitle: title
      };
    });

    this.write(data);
  }

  updateSourceCheckMetadata(
    sourceId: number,
    checkedAt: string,
    headEtag: string | null,
    headLastModified: string | null
  ) {
    const data = this.read();
    data.sources = data.sources.map((source) => {
      if (source.id !== sourceId) {
        return source;
      }
      return {
        ...source,
        lastCheckedAt: checkedAt,
        lastHeadEtag: headEtag,
        lastHeadLastModified: headLastModified
      };
    });

    this.write(data);
  }

  insertItems(sourceId: number, items: NewItem[]): number {
    if (items.length === 0) {
      return 0;
    }

    const data = this.read();
    const source = data.sources.find((value) => value.id === sourceId);
    if (!source) {
      return 0;
    }

    let insertedCount = 0;
    for (const item of items) {
      const duplicated = data.items.some(
        (existing) =>
          existing.link === item.link ||
          (existing.sourceId === sourceId && existing.guid === item.guid)
      );
      if (duplicated) {
        continue;
      }

      data.items.push({
        id: data.nextItemId,
        sourceId,
        sourceTitle: source.title,
        guid: item.guid,
        title: item.title,
        link: item.link,
        summary: item.summary,
        publishedAt: item.publishedAt,
        createdAt: new Date().toISOString()
      });

      data.nextItemId += 1;
      insertedCount += 1;
    }

    this.write(data);
    return insertedCount;
  }

  listItems(limit: number, offset: number): ItemRow[] {
    const data = this.read();
    return [...data.items]
      .sort((a, b) => {
        const left = a.publishedAt ?? a.createdAt;
        const right = b.publishedAt ?? b.createdAt;
        return left < right ? 1 : -1;
      })
      .slice(offset, offset + limit);
  }
}
