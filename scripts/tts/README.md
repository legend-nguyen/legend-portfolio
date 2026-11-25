# Offline Text-to-Speech (TTS) Pipeline (`about.intro`)

Thư mục này chứa pipeline **offline** dùng để sinh file âm thanh `.mp3` và dữ liệu **word-level timestamps** (`.json`) cho phần giới thiệu (`about.intro`) ở hai ngôn ngữ Tiếng Anh (`en`) và Tiếng Việt (`vi`).

## Lưu ý bản quyền & Kiến trúc

- Công cụ sinh giọng đọc sử dụng thư viện mã nguồn mở [**edge-tts**](https://github.com/rany2/edge-tts), phát hành theo giấy phép **LGPL-3.0**.
- **Quan trọng**: `edge-tts` là thư viện **không chính thức** sử dụng dịch vụ Read Aloud của Microsoft Edge. Vì vậy, thư viện này **chỉ được chạy offline trong quá trình phát triển/build** để xuất ra file tĩnh trong `public/audio/about/` và **tuyệt đối không được gọi lúc runtime** khi người dùng truy cập.

## Yêu cầu môi trường

- **Node.js 22.6+** (hỗ trợ chạy trực tiếp file `.ts`)
- **Python 3.9+** cùng gói `edge-tts`:

```bash
pip install edge-tts
```

Bạn có thể kiểm tra danh sách giọng đọc khả dụng bằng lệnh:

```bash
edge-tts --list-voices
```

## Quy trình hoạt động

1. **`extract-text.ts`**: Đọc trực tiếp từ điển dịch `shared/i18n/translates/lang-en.ts` và `lang-vn.ts` thông qua hàm chuẩn hóa `buildAboutIntroFromDictionary` (`shared/i18n/about-intro-text.ts`), tính mã băm `SHA-256` (`textHash`) và xuất ra `scripts/tts/.cache/intro-input.json`. Không sao chép tay nội dung để tránh sai lệch.
2. **`generate_tts.py`**: Gọi `edge_tts.Communicate(..., boundary="WordBoundary")` và `.stream()` để:
   - Lưu luồng âm thanh định dạng `audio-24khz-48kbitrate-mono-mp3` vào `public/audio/about/intro.{lang}.mp3`.
   - Quy đổi `offset` và `duration` từ đơn vị `100ns` sang **giây**.
   - Căn chỉnh (alignment) từng từ trong `WordBoundary` về đúng vị trí ký tự `charStart` / `charEnd` trong chuỗi gốc (hỗ trợ chuẩn hóa dấu nháy cong `’`, dấu gạch ngang và tiếng Việt có dấu). Báo lỗi ngay nếu lệch bất kỳ từ nào.
   - Xuất file `public/audio/about/intro.{lang}.json`.
3. **`check-tts.ts`**: Đối chiếu `textHash` và toàn bộ dải `[charStart, charEnd]` trong `public/audio/about/intro.{lang}.json` với nội dung hiện tại trong `lang-en.ts` và `lang-vn.ts`. Báo lỗi (exit code `1`) nếu nội dung đã sửa nhưng chưa chạy lại lệnh sinh âm thanh.

## Các lệnh `npm run`

```bash
# Sinh lại toàn bộ file .mp3 và .json cho cả EN & VI
npm run tts:generate

# Tuỳ chọn đổi giọng đọc khi sinh:
python scripts/tts/generate_tts.py --en-voice en-US-GuyNeural --vi-voice vi-VN-NamMinhNeural

# Kiểm tra tính toàn vẹn của file âm thanh và textHash
npm run tts:check
```
