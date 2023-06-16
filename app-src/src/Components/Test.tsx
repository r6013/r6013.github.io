import { Carousel } from './Carousel'
import { Footer } from './Footer'
import { Header } from './Header'

export function Test() {
    return (
        <>
            <Header></Header>

            <Carousel>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((val) => {
                    return (
                        <div
                            // className="card"
                            style={{
                                width: '300px',
                                height: '300px',
                                border: '1px solid black',
                            }}
                        ></div>
                    )
                })}
            </Carousel>

            <Footer></Footer>
        </>
    )
}
