export default function Link({ href, children }) {
  return (
    <p>
      <a href={href}>{children}</a>
    </p>
  )
}