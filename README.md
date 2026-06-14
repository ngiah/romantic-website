# Thư gửi Thư

Website thả thính cute chạy hoàn toàn trên localhost, không cần cài package.

## Chạy web

```powershell
python -m http.server 4173
```

Sau đó mở `http://localhost:4173`.

Visual postcard/sticker trong `assets/` được tạo bằng Canva.

## Nhận kết quả chọn date

Mặc định, nút chốt kèo sẽ mở email có nội dung lựa chọn được điền sẵn.

Để gửi tự động, đặt một form/webhook endpoint công khai trong `config.js`:

```js
window.DATE_RESPONSE_ENDPOINT = "https://your-public-endpoint.example";
```

Không đặt mật khẩu, private API key hoặc secret token trong frontend.
