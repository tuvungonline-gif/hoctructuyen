async function checkProductionStatus() {
  const badge = document.createElement("div");
  badge.id = "productionStatusBadge";
  badge.style.position = "fixed";
  badge.style.right = "14px";
  badge.style.bottom = "86px";
  badge.style.zIndex = "90";
  badge.style.padding = "10px 12px";
  badge.style.borderRadius = "999px";
  badge.style.fontSize = "12px";
  badge.style.fontWeight = "800";
  badge.style.boxShadow = "0 14px 34px rgba(15, 23, 42, 0.18)";

  try {
    const response = await fetch("/api/config", { cache: "no-store" });
    const config = await response.json();
    if (config.productionReady) {
      badge.textContent = "Production: Supabase đã cấu hình";
      badge.style.background = "#dcfce7";
      badge.style.color = "#166534";
      badge.style.border = "1px solid #86efac";
      window.EDU_PRODUCTION_CONFIG = config;
    } else {
      badge.textContent = "Demo: chưa cấu hình Supabase";
      badge.style.background = "#fffbeb";
      badge.style.color = "#92400e";
      badge.style.border = "1px solid #fde68a";
    }
  } catch (error) {
    badge.textContent = "Không đọc được /api/config";
    badge.style.background = "#fee2e2";
    badge.style.color = "#991b1b";
    badge.style.border = "1px solid #fecaca";
  }

  document.body.appendChild(badge);
}

checkProductionStatus();
