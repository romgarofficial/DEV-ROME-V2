import Script from "next/script";

export function Analytics() {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;

  return (
    <>
      {plausible ? (
        <Script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
        />
      ) : null}
      {umamiId && umamiSrc ? (
        <Script defer src={umamiSrc} data-website-id={umamiId} />
      ) : null}
    </>
  );
}
