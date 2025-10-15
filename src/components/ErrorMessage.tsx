
type ErrorMessageProps = {
    children : React.ReactNode
}

export default function ErrorMessage({children} : ErrorMessageProps) {
  return (
    <p className="bg-red-500/10 text-red-400 text-sm font-semibold p-2 text-center rounded-lg mt-2">
      {children}
    </p>
  )
}
