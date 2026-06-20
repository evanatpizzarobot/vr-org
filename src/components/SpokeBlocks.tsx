// Shared visible blocks for the headset "spoke" pages: a comparison table and
// an on-page FAQ rendered from the same faqPageSchema object already used for
// JSON-LD, so the visible text and the structured data never drift apart.

interface ComparisonTableProps {
  caption: string;
  columns: string[];
  rows: string[][];
}

export function ComparisonTable({ caption, columns, rows }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-x-auto">
      <table
        className="w-full border-collapse text-[14px]"
        style={{ color: "var(--text-secondary)" }}
      >
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className="text-left font-semibold p-2.5 border-b"
                style={{ color: "var(--text-primary)", borderColor: "var(--border)" }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="p-2.5 align-top"
                  style={{
                    borderBottom:
                      "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
                    color: j === 0 ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: j === 0 ? 600 : 400,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-[12px] mt-2" style={{ color: "var(--text-muted)" }}>
        {caption}
      </p>
    </div>
  );
}

interface FaqSchema {
  mainEntity: { name: string; acceptedAnswer: { text: string } }[];
}

export function FaqSection({
  schema,
  heading = "Frequently asked questions",
}: {
  schema: FaqSchema;
  heading?: string;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold mb-4">{heading}</h2>
      {schema.mainEntity.map((q, i) => (
        <div key={i} className="mb-5">
          <h3
            className="font-display text-[17px] font-semibold mb-1.5"
            style={{ color: "var(--text-primary)" }}
          >
            {q.name}
          </h3>
          <p
            className="text-[15px] leading-[1.7]"
            style={{ color: "var(--text-secondary)" }}
          >
            {q.acceptedAnswer.text}
          </p>
        </div>
      ))}
    </section>
  );
}
