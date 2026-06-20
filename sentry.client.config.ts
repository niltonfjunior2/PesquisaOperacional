import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "",
  tracesSampleRate: 1.0,
  debug: false,
  sendDefaultPii: false, // Strict LGPD compliance
  beforeSend(event) {
    // Strip request URLs and IPs
    if (event.request) {
      delete event.request.url;
      if (event.request.headers) {
        delete event.request.headers['x-forwarded-for'];
        delete event.request.headers['user-agent'];
      }
    }
    if (event.user) {
      delete event.user.ip_address;
    }
    return event;
  },
});
