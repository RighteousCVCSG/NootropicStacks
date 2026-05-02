import { Helmet } from 'react-helmet-async';

// Escape any literal "</" so a stray closing-script-tag in user-supplied
// content (e.g. an article excerpt that mentions HTML) cannot break out
// of the <script type="application/ld+json"> wrapper.
function safeStringify(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <Helmet>
      <script type="application/ld+json">{safeStringify(data)}</script>
    </Helmet>
  );
}
