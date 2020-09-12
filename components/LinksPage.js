import Head from 'next/head'
import GAnalytics from 'components/GAnalytics'

export default function LinksPage({
  pageTitle,
  title,
  subtitle,
  children
}) {
  return (
    <>
      <Head>
        <title>{`${pageTitle} - Gerald Nash`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="The personal site of Gerald Nash, technologist and student." />
        <meta name="author" content="Gerald Nash" />
        <meta name="theme-color" content="#ffffff" />
        <link href="https://fonts.googleapis.com/css?family=Fira+Mono&display=swap" rel="stylesheet" media="all" />
        <link href="https://aunyks.com/styles/index.css" rel="stylesheet" media="all" />
        <link rel="icon" type="image/png" href="https://aunyks.com/favicon.png" />
      </Head>
      <div id="container">
        <span id="logo"><a href="https://aunyks.com">⚡️</a></span>
        <h1 id="title">{title}</h1>
        <div id="links">
          {children}
        </div>
      </div>
    </>
  )
}