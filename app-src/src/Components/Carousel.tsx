import { useRef } from 'react'

export function Carousel({ children }: { children?: any }) {
    const carouselRef = useRef(null)
    if (children?.length == 1) {
        return <div className="carousel no-scrollbar">{children}</div>
    }
    return (
        <div>
            <div
                className="carousel"
                ref={carouselRef}
                style={{ scrollSnapType: 'both mandatory' }}
            >
                {children}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                    style={
                        {
                            // maxHeight: '2rem',
                            // margin: '1rem',
                            // position: 'absolute',
                            // left: '-5rem',
                            // zIndex: 99999,
                        }
                    }
                    onClick={() => {
                        // carouselRef?.current?.scrollTo({
                        //     left: 0,
                        //     behavior: 'smooth',
                        // })
                        const singleElementWidth =
                            carouselRef.current?.children[0].offsetWidth
                        if (
                            carouselRef.current?.scrollLeft -
                                singleElementWidth <
                            0
                        ) {
                            carouselRef?.current?.scrollTo({
                                left: 0,
                                // behavior: 'smooth',
                            })
                        }
                        carouselRef?.current?.scrollBy({
                            left: -singleElementWidth,
                            // behavior: 'smooth',
                        })
                    }}
                >
                    &lt;
                </button>
                <button
                    style={
                        {
                            // maxHeight: '2rem',
                            // margin: '1rem',
                            // position: 'absolute',
                            // left: carouselRef.current?.offsetWidth,
                        }
                    }
                    onClick={() => {
                        const singleElementWidth =
                            carouselRef.current?.children[0].offsetWidth
                        if (
                            carouselRef.current?.scrollLeft +
                                singleElementWidth >
                            carouselRef.current?.scrollWidth
                        ) {
                            carouselRef?.current?.scrollTo({
                                left: carouselRef.current.scrollWidth,
                                // behavior: 'smooth',
                            })
                        }
                        carouselRef?.current?.scrollBy({
                            left: singleElementWidth,
                            // behavior: 'smooth',
                        })
                    }}
                >
                    &gt;
                </button>
            </div>
        </div>
    )
}
