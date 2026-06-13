function fixAdminPlaceholderButtons() {
  const buttons = Array.from(document.querySelectorAll('button'));

  buttons.forEach(function (button) {
    const onclick = button.getAttribute('onclick') || '';
    const text = (button.textContent || '').trim();

    if (onclick.includes('Demo UI') && text.includes('Thêm khóa học')) {
      button.removeAttribute('onclick');
      button.textContent = '+ Thêm khóa học';
      button.addEventListener('click', function () {
        window.location.hash = '#/admin-content';
      });
    }

    if (onclick.includes('Demo UI') && text === 'Sửa') {
      button.removeAttribute('onclick');
      button.textContent = 'Mở studio';
      button.addEventListener('click', function () {
        window.location.hash = '#/admin-content';
      });
    }
  });
}

window.addEventListener('hashchange', function () {
  setTimeout(fixAdminPlaceholderButtons, 80);
});

document.addEventListener('DOMContentLoaded', function () {
  setTimeout(fixAdminPlaceholderButtons, 120);
});

setTimeout(fixAdminPlaceholderButtons, 300);
