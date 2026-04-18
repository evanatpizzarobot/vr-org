// Inline script to prevent flash of wrong theme on load.
// Dark is the default; only a stored user preference overrides.
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('vr-org-theme');
        if (stored === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
        }
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
