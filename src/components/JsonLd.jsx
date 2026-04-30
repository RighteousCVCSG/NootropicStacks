import { Helmet } from 'react-helmet-async';

// Escape sequences that would break out of <script> context or trip JSON parsers
// embedded in HTML — </script>, U+2028 LINE SEPARATOR, U+2029 PARAGRAPH SEPARATOR.
function safeStringify(data) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/ /g, '\\u2028')
    .replace(/ /g, '\\u2029');
}

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <Helmet>
      <script type="application/ld+json">{safeStringify(data)}</script>
    </Helmet>
  );
}
