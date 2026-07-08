export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.info("[gobybudget]", {
      level: "info",
      message: "Server instrumentation registered.",
      monitoringWebhookConfigured: Boolean(process.env.MONITORING_WEBHOOK_URL),
      timestamp: new Date().toISOString(),
    });
  }
}
