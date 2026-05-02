// Per-endpoint data-freshness SLA registry for VR.org premium endpoints.
//
// If the data backing a response was captured longer ago than the SLA permits,
// the bearer is not charged. The receipt records no_charge_reason: "stale_data"
// and the response carries stale: true so the agent can decide to retry later.
//
// null means no SLA applies (compute-only or immutable historical data).

export interface FreshnessSLA {
  maxAgeSeconds: number;
}

export const ENDPOINT_FRESHNESS: Record<string, FreshnessSLA | null> = {
  // News search rolls forward as the RSS engine refreshes (every 15 min).
  // Give 30 min headroom so a brief upstream lag doesn't trip stale_data.
  "/api/premium/news/search": { maxAgeSeconds: 30 * 60 },
};

export function resolveSLA(path: string): FreshnessSLA | null {
  if (path in ENDPOINT_FRESHNESS) return ENDPOINT_FRESHNESS[path];
  const segments = path.split("/").filter(Boolean);
  while (segments.length > 0) {
    segments.pop();
    const prefix = "/" + segments.join("/");
    if (prefix in ENDPOINT_FRESHNESS) return ENDPOINT_FRESHNESS[prefix];
  }
  return null;
}

export interface StalenessCheck {
  stale: boolean;
  ageSeconds: number | null;
  slaSeconds: number | null;
  capturedAt: string | null;
  applies: boolean;
}

export function checkStaleness(
  endpoint: string,
  capturedAt: string | null,
  now: Date = new Date(),
): StalenessCheck {
  const sla = resolveSLA(endpoint);
  if (!sla) {
    return {
      stale: false,
      ageSeconds: null,
      slaSeconds: null,
      capturedAt,
      applies: false,
    };
  }
  if (!capturedAt) {
    return {
      stale: false,
      ageSeconds: null,
      slaSeconds: sla.maxAgeSeconds,
      capturedAt: null,
      applies: true,
    };
  }
  const captured = Date.parse(capturedAt);
  if (!Number.isFinite(captured)) {
    return {
      stale: false,
      ageSeconds: null,
      slaSeconds: sla.maxAgeSeconds,
      capturedAt,
      applies: true,
    };
  }
  const ageSeconds = Math.max(
    0,
    Math.floor((now.getTime() - captured) / 1000),
  );
  return {
    stale: ageSeconds > sla.maxAgeSeconds,
    ageSeconds,
    slaSeconds: sla.maxAgeSeconds,
    capturedAt,
    applies: true,
  };
}

const SLA_REASONS: Record<string, string> = {
  "/api/premium/news/search":
    "VR/AR/XR news index refreshes every 15 min via the RSS engine",
};

export function describeSLAs(): Array<{
  endpoint: string;
  max_age_seconds: number | null;
  reason: string;
}> {
  return Object.entries(ENDPOINT_FRESHNESS).map(([endpoint, sla]) => ({
    endpoint,
    max_age_seconds: sla?.maxAgeSeconds ?? null,
    reason: SLA_REASONS[endpoint] ?? "",
  }));
}
