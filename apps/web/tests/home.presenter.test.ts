import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  formatPublishedLabel,
  getHostLabel,
  parseStatusLabel,
  toSummary
} from "../app/routes/home.presenter.js";

describe("web home presenter regression", () => {
  it("status 라벨 매핑은 운영 상태코드를 사용자 문구로 변환한다", () => {
    assert.equal(parseStatusLabel("source-added"), "RSS 소스를 등록했습니다.");
    assert.equal(parseStatusLabel("source-duplicate"), "이미 등록된 RSS 소스입니다.");
    assert.equal(parseStatusLabel("config-error"), "서버 설정을 확인한 뒤 다시 시도해 주세요.");
    assert.equal(parseStatusLabel("unknown"), null);
  });

  it("summary는 html 제거 + 길이 제한을 적용한다", () => {
    assert.equal(toSummary("<p>Hello <b>world</b></p>"), "Hello world");

    const longText = "a".repeat(200);
    const summary = toSummary(longText);
    assert.equal(summary.endsWith("…"), true);
    assert.equal(summary.length, 141);
  });

  it("발행일/호스트 라벨은 fallback을 가진다", () => {
    assert.equal(formatPublishedLabel(null), "발행일 없음");
    assert.equal(getHostLabel("https://www.example.com/posts/1"), "example.com");
    assert.equal(getHostLabel("not-a-url"), "원문");
  });
});
