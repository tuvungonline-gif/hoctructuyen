function cleanProductionUI() {
  document.querySelectorAll('.demo-note').forEach(function (el) { el.remove(); });
  document.querySelectorAll('.warning-box').forEach(function (el) { el.remove(); });
  document.querySelectorAll('.secure-box').forEach(function (el) { el.remove(); });
  document.querySelectorAll('.chip.warning').forEach(function (el) { el.remove(); });

  document.querySelectorAll('p, small, span, h1, h2, h3, strong, a, button').forEach(function (el) {
    if (!el.childElementCount) {
      el.textContent = el.textContent
        .replaceAll('demo', '')
        .replaceAll('Demo', '')
        .replaceAll('localStorage', 'hệ thống')
        .replaceAll('mẫu', '')
        .replaceAll('kiểm thử', 'quản lý')
        .replaceAll('Admin ', 'Quản trị ')
        .replaceAll('Tạo tài khoản ', 'Tạo tài khoản')
        .replaceAll('Video  placeholder - chưa dùng video thật', 'Video bài học')
        .replaceAll('  ', ' ')
        .trim();
    }
  });
}

window.addEventListener('hashchange', function () {
  setTimeout(cleanProductionUI, 200);
});

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(cleanProductionUI, 300);
});

setTimeout(cleanProductionUI, 800);
