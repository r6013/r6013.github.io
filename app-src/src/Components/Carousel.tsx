import { useRef } from 'react'

export function Carousel({ children }: { children?: any }) {
    const carouselRef = useRef(null)
    if (children?.length == 1) {
        return <div className="carousel no-scrollbar">{children}</div>
    }
    return (
        <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <button
                style={{ maxHeight: '2rem', margin: '1rem' }}
                onClick={() => {
                    // carouselRef?.current?.scrollTo({
                    //     left: 0,
                    //     behavior: 'smooth',
                    // })
                    const singleElementWidth =
                        carouselRef.current.children[0].offsetWidth
                    carouselRef?.current?.scrollBy({
                        left: -singleElementWidth,
                        // behavior: 'smooth',
                    })
                }}
            >
                &lt;
            </button>
            <div
                className="carousel"
                ref={carouselRef}
                style={{ scrollSnapType: 'both mandatory' }}
            >
                {children}
            </div>
            <button
                style={{ maxHeight: '2rem', margin: '1rem' }}
                onClick={() => {
                    const singleElementWidth =
                        carouselRef.current.children[0].offsetWidth
                    carouselRef?.current?.scrollBy({
                        left: singleElementWidth,
                        // behavior: 'smooth',
                    })
                }}
            >
                &gt;
            </button>
        </div>
    )
}
