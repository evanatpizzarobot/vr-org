// Deterministic JSON serialization. Required so receipt signatures are
// reproducible by any verifier regardless of how their JSON library
// happens to serialize. Keys sorted lexicographically, no whitespace,
// standard JSON escaping. NaN, Infinity, undefined throw.

export function canonicalJSON(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("canonicalJSON: non-finite number not allowed");
    }
    return JSON.stringify(value);
  }
  if (typeof value === "string") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map(canonicalJSON).join(",") + "]";
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const parts = keys.map(
      (k) => JSON.stringify(k) + ":" + canonicalJSON(obj[k]),
    );
    return "{" + parts.join(",") + "}";
  }
  throw new Error(`canonicalJSON: unsupported value type ${typeof value}`);
}
