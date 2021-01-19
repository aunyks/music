export default function Link({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  )
}