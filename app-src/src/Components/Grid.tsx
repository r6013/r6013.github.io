export function Grid({ children }) {
  return (
    <div className="grid" style={{ scrollSnapType: 'both mandatory' }}>
      {children}
    </div>
  )
}
