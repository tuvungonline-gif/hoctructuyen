function addR2UploadEntry() {
  const isAdminRoute = window.location.hash.includes('/admin') || window.location.hash.includes('/admin-content');
  if (!isAdminRoute) return;
  if (document.querySelector('#r2UploadEntryCard')) return;

  const target = document.querySelector('.container');
  if (!target) return;

  const card = document.createElement('div');
  card.id = 'r2UploadEntryCard';
  card.className = 'card pad';
  card.style.marginBottom = '18px';
  card.innerHTML = `
    <div class="lesson-sidebar-head">
      <div>
        <span class="eyebrow">Production LMS</span>
        <h2>Tạo khóa học và upload video tự động</h2>
        <p class="muted">Admin chỉ cần nhập tên khóa học, tên bài học và chọn video. Hệ thống sẽ tự tạo dữ liệu trong Supabase, upload video lên R2 và gắn video vào bài học.</p>
      </div>
      <span class="chip warning">Supabase + R2</span>
    </div>
    <div class="warning-box" style="margin:12px 0">
      <strong>Lưu ý:</strong> Cần cấu hình đủ Supabase, R2 và tài khoản admin production trước khi dùng.
    </div>
    <div class="form-actions">
      <a class="btn btn-primary" href="/production-course-manager.html">Tạo khóa học + Upload video</a>
      <a class="btn btn-light" href="/r2-console.html">R2 console nâng cao</a>
      <a class="btn btn-light" href="/api/config" target="_blank">Kiểm tra cấu hình</a>
    </div>
  `;

  target.insertBefore(card, target.firstElementChild);
}

window.addEventListener('hashchange', function () {
  setTimeout(addR2UploadEntry, 120);
});

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(addR2UploadEntry, 300);
});

setTimeout(addR2UploadEntry, 500);
