import Head from 'next/head'

export default function DefaultHead({
  title,
  subtitle,
  description,
  cardImage
}) {
  const effectiveTitle = !!subtitle ? `${title}: ${subtitle}` : title
  return (
    <Head>
      <title>{effectiveTitle}</title>
      <meta key="charset" charSet="UTF-8" />
      <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta key="description" name="description" content={description} />
      <meta key="author" name="author" content="Gerald Nash" />
      <meta key="theme-color" name="theme-color" content="#5d44f8" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      {!!cardImage ? (
        <meta name="twitter:card" content="summary_large_image" />
      ) : (
          <meta name="twitter:card" content="summary" />
        )}
      <meta name="twitter:site" content="@aunyks" />
      <meta name="twitter:creator" content="@aunyks" />
      <meta name="twitter:title" content={effectiveTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={cardImage || 'https://music.aunyks.com/img/default-card-image.png'} />
    </Head>
  )
}