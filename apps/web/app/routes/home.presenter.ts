import * as R from "remeda";
import { match } from "ts-pattern";

export const parseStatusLabel = (status: string | null) =>
  match(status)
    .with("source-added", () => "RSS 소스를 등록했습니다.")
    .with("synced", () => "동기화를 완료했습니다.")
    .with("source-error", () => "RSS 등록에 실패했습니다.")
    .with("sync-error", () => "동기화에 실패했습니다.")
    .otherwise(() => null);

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ");

export const toSummary = (value: string | null) => {
  const normalized = R.pipe(
    value ?? "",
    stripHtml,
    (text) => text.replace(/\s+/g, " ").trim()
  );

  return match(normalized.length)
    .with(0, () => "요약이 아직 없습니다.")
    .when((length) => length <= 140, () => normalized)
    .otherwise(() => `${normalized.slice(0, 140)}…`);
};

export const formatPublishedLabel = (publishedAt: string | null) => {
  if (!publishedAt) {
    return "발행일 없음";
  }

  return new Date(publishedAt).toLocaleDateString("ko-KR", {
    month: "2-digit",
    day: "2-digit"
  });
};

export const getHostLabel = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch (_error) {
    return "원문";
  }
};
