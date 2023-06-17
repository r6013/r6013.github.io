import { useMatch } from '@tanstack/react-location'
import { Header } from './Header'
import { Footer } from './Footer'
import { Carousel } from './Carousel'
import { ShowCard } from './ShowCard'

export function BandPage() {
    const {
        data: { band },
    } = useMatch()
    return (
        <>
            <Header></Header>
            {/* <div>{JSON.stringify(band)}</div> */}
            <Carousel>
                {band?.shows?.map((show) => (
                    <ShowCard show={show} />
                ))}
            </Carousel>
            <Footer></Footer>
        </>
    )
}
