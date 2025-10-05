
type ErrorMessageProps = {
    children : React.ReactNode
}

export default function ErrorMessage({children} : ErrorMessageProps) {
  return (
    <p className="bg-red-50 text-red-600 uppercase text-sm font-bold p-3 text-center">{children}</p>
  )
}
