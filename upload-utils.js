/**
 * upload-utils.js
 * Shared utility module for video upload handling.
 * Provides error classification, retry logic, timeout management, and progress tracking.
 */

export const MAX_FILE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
export const UPLOAD_TIMEOUT_MS = 30 * 60 * 1000;       // 30 minutes
export const MAX_RETRIES = 3;
export const RETRY_DELAY_MS = 3000;                     // 3 seconds between retries

/**
 * Format a byte count into a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024) return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB";
  return (bytes / 1024).toFixed(0) + " KB";
}

/**
 * Classify a raw error message into a user-friendly Vietnamese string.
 * Covers: CORS, network, timeout, file size, HTTP status codes, and server errors.
 * @param {string} message - Raw error message from fetch or server
 * @param {string} [step]  - Optional step label for context (e.g. "upload video")
 * @returns {string}
 */
export function friendlyError(message, step) {
  const prefix = step ? "Bước lỗi: " + step + "\n" : "";
  const msg = message || "";

  if (msg === "Server returned non-JSON response") {
    return prefix + "Máy chủ đang trả HTML/trang lỗi thay vì JSON. Kiểm tra Base API URL, route deploy hoặc backend.";
  }
  if (/Failed to fetch/i.test(msg)) {
    return prefix + "Không kết nối được backend (Failed to fetch). Nguyên nhân có thể: (1) Backend chưa chạy, (2) URL sai — hãy dán link Railway HTTPS vào ô Base API URL, (3) CORS chưa cấu hình đúng — kiểm tra biến CORS_ORIGINS trên Railway.";
  }
  if (/NetworkError|net::ERR/i.test(msg)) {
    return prefix + "Lỗi mạng (NetworkError). Kiểm tra kết nối internet và URL backend.";
  }
  if (/Load failed/i.test(msg)) {
    return prefix + "Không tải được dữ liệu từ backend (Load failed). Kiểm tra URL và CORS.";
  }
  if (/AbortError|timeout|timed out|ETIMEDOUT/i.test(msg)) {
    return prefix + "Hết thời gian chờ (timeout). File quá lớn hoặc kết nối chậm. Thử lại hoặc dùng file nhỏ hơn.";
  }
  if (/413|too large|File too large/i.test(msg)) {
    return prefix + "File quá lớn. Kích thước tối đa cho phép là 2 GB.";
  }
  if (/504/i.test(msg)) {
    return prefix + "Backend timeout (504). Upload mất quá nhiều thời gian — thử lại với file nhỏ hơn hoặc kiểm tra kết nối.";
  }
  if (/CORS/i.test(msg)) {
    return prefix + "Lỗi CORS. Backend chưa cho phép domain này. Kiểm tra biến CORS_ORIGINS trên Railway.";
  }
  if (/Admin permission required|Login required/i.test(msg) || /permission/i.test(msg)) {
    return prefix + "Phiên đăng nhập hiện tại chưa có quyền. Hãy đăng nhập tài khoản admin nội bộ hoặc cấu hình ADMIN_TOKEN.";
  }
  if (/401/i.test(msg)) {
    return prefix + "Chưa xác thực (401). Hãy đăng nhập lại hoặc kiểm tra ADMIN_TOKEN.";
  }
  if (/403/i.test(msg)) {
    return prefix + "Không có quyền truy cập (403). Tài khoản hiện tại không phải admin.";
  }
  if (/404/i.test(msg)) {
    return prefix + "Không tìm thấy (404). Kiểm tra lại ID khóa học / bài học hoặc URL backend.";
  }
  if (/500/i.test(msg)) {
    return prefix + "Lỗi máy chủ (500). Kiểm tra log Railway để biết chi tiết.";
  }
  return prefix + (msg || "Có lỗi xảy ra. Vui lòng thử lại.");
}

/**
 * Determine whether an error is worth retrying (network/timeout errors, not auth or 4xx).
 * @param {Error} error
 * @returns {boolean}
 */
export function isRetryableError(error) {
  if (error.name === "AbortError") return true;
  const msg = error.message || "";
  return /Failed to fetch|NetworkError|Load failed|net::ERR|ETIMEDOUT/i.test(msg);
}

/**
 * Sleep for a given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

/**
 * Validate a file before upload.
 * Throws a descriptive Error if the file exceeds the size limit.
 * @param {File} file
 * @param {number} [maxBytes=MAX_FILE_BYTES]
 */
export function validateFile(file, maxBytes) {
  const limit = maxBytes !== undefined ? maxBytes : MAX_FILE_BYTES;
  if (file.size > limit) {
    throw new Error("File too large: " + formatBytes(file.size) + ". Maximum allowed size is " + formatBytes(limit) + ".");
  }
}

/**
 * Upload a file to the backend proxy endpoint with timeout, retry, and progress callbacks.
 *
 * @param {object}   opts
 * @param {string}   opts.baseUrl        - Backend base URL (e.g. "https://app.up.railway.app")
 * @param {string}   opts.courseId       - Course ID
 * @param {string}   opts.lessonId       - Lesson ID
 * @param {File}     opts.file           - File to upload
 * @param {string}   opts.authToken      - Bearer token for Authorization header
 * @param {number}   [opts.timeoutMs]    - Per-attempt timeout in ms (default: UPLOAD_TIMEOUT_MS)
 * @param {number}   [opts.maxRetries]   - Max retry attempts (default: MAX_RETRIES)
 * @param {number}   [opts.retryDelayMs] - Delay between retries in ms (default: RETRY_DELAY_MS)
 * @param {function} [opts.onAttempt]    - Called with (attempt, maxRetries) before each attempt
 * @param {function} [opts.onRetry]      - Called with (attempt, maxRetries, errorMessage) before retry
 * @returns {Promise<object>} - Parsed JSON response from the server
 */
export async function uploadFile(opts) {
  const {
    baseUrl = "",
    courseId,
    lessonId,
    file,
    authToken,
    timeoutMs = UPLOAD_TIMEOUT_MS,
    maxRetries = MAX_RETRIES,
    retryDelayMs = RETRY_DELAY_MS,
    onAttempt,
    onRetry
  } = opts;

  validateFile(file);

  const params = new URLSearchParams({
    courseId,
    lessonId,
    fileName: file.name,
    contentType: file.type || "video/mp4"
  });
  const url = (baseUrl.replace(/\/$/, "")) + "/api/admin/r2/upload-proxy?" + params.toString();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (typeof onAttempt === "function") onAttempt(attempt, maxRetries);

    const controller = new AbortController();
    const timeoutId = setTimeout(function () { controller.abort(); }, timeoutMs);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + authToken,
          "Content-Type": file.type || "video/mp4"
        },
        body: file,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch (_) { json = {}; }

      if (!text.trim().startsWith("{") && !text.trim().startsWith("[")) {
        throw new Error("Server returned non-JSON response");
      }
      if (!res.ok) {
        throw new Error(json.error || ("HTTP " + res.status));
      }
      return json;

    } catch (err) {
      clearTimeout(timeoutId);

      const isAbort = err.name === "AbortError";
      const errMsg = isAbort
        ? "Upload timeout after " + Math.round(timeoutMs / 60000) + " minutes. File may be too large or connection too slow."
        : err.message;

      const canRetry = (isAbort || isRetryableError(err)) && attempt < maxRetries;
      if (canRetry) {
        if (typeof onRetry === "function") onRetry(attempt, maxRetries, errMsg);
        await sleep(retryDelayMs);
        continue;
      }

      throw new Error(friendlyError(errMsg, "upload (attempt " + attempt + ")"));
    }
  }
}
