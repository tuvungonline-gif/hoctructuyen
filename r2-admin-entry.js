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
        <span class="eyebrow">Production video</span>
        <h2>Upload video lên Cloudflare R2</h2>
        <p class="muted">Dùng trang này để upload video thật, gắn video vào bài học và test signed URL xem video.</p>
      </div>
      <span class="chip warning">R2</span>
    </div>
    <div class="warning-box" style="margin:12px 0">
      <strong>Lưu ý:</strong> Cần cấu hình đủ biến R2 và Supabase trên Railway trước khi upload video thật.
    </div>
    <div class="form-actions">
      <a class="btn btn-primary" href="/r2-console.html">Mở trang upload video R2</a>
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
