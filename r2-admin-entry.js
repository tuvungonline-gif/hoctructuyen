function addR2UploadEntry() {
  const isAdminRoute = window.location.hash.includes('/admin') || window.location.hash.includes('/admin-content');
  if (!isAdminRoute) return;
  if (document.querySelector('#r2UploadEntrySection')) return;

  const app = document.querySelector('#app');
  const firstSection = app ? app.querySelector('section') : null;
  if (!app) return;

  const section = document.createElement('section');
  section.id = 'r2UploadEntrySection';
  section.className = 'section-tight production-admin-entry';
  section.innerHTML = `
    <div class="container">
      <article class="card pad production-admin-card">
        <div class="production-admin-content">
          <div>
            <span class="eyebrow">Quản trị khóa học</span>
            <h2>Tạo khóa học và upload video</h2>
            <p class="muted">Tạo khóa học, tạo bài học và đưa video lên Cloudflare R2 trong một quy trình.</p>
          </div>
          <div class="production-admin-actions">
            <a class="btn btn-primary" href="/production-course-manager.html">Tạo khóa học</a>
            <a class="btn btn-light" href="/r2-console.html">Quản lý video</a>
          </div>
        </div>
      </article>
    </div>
  `;

  if (firstSection && firstSection.nextSibling) {
    app.insertBefore(section, firstSection.nextSibling);
  } else {
    app.prepend(section);
  }
}

window.addEventListener('hashchange', function () {
  setTimeout(addR2UploadEntry, 120);
});

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(addR2UploadEntry, 300);
});

setTimeout(addR2UploadEntry, 500);
