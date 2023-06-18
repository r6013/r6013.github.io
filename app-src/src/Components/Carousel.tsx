export function Carousel({ children }: { children?: any }) {
  return (
    <>
      <div className="carousel" style={{ scrollSnapType: 'x mandatory' }}>
        {children}
      </div>
    </>
  )
}
