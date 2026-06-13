async function checkProductionStatus() {
  try {
    const response = await fetch("/api/config", { cache: "no-store" });
    const config = await response.json();
    window.EDU_PRODUCTION_CONFIG = config;
    console.info("EduVideo production config", {
      productionReady: Boolean(config.productionReady),
      r2Ready: Boolean(config.r2Ready),
      videoMode: config.videoMode || "demo"
    });
  } catch (error) {
    console.warn("Không đọc được /api/config", error);
  }
}

checkProductionStatus();
