// Simple at-a-glance comparison table for the headset comparison spoke pages.
// Server component (no client JS). Horizontally scrollable on narrow screens.

interface SpecRow {
  label: string;
  a: string;
  b: string;
}

export function SpecTable({
  headers,
  rows,
}: {
  headers: [string, string, string];
  rows: SpecRow[];
}) {
  return (
    <div className="overflow-x-auto my-7">
      <table
        className="w-full text-[13px] border-collapse"
        style={{ color: "var(--text-secondary)" }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            <th
              className="text-left py-2.5 pr-4 font-display font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              {headers[0]}
            </th>
            <th
              className="text-left py-2.5 px-4 font-display font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {headers[1]}
            </th>
            <th
              className="text-left py-2.5 px-4 font-display font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {headers[2]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderBottom: "1px solid var(--border)" }}>
              <td
                className="py-2.5 pr-4 font-medium align-top"
                style={{ color: "var(--text-muted)" }}
              >
                {r.label}
              </td>
              <td className="py-2.5 px-4 align-top">{r.a}</td>
              <td className="py-2.5 px-4 align-top">{r.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
