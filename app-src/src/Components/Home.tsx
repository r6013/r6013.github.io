import { Header } from './Header'
import './Home.css'
import { Footer } from './Footer'
import { useQuery } from '@tanstack/react-query'
import { getRecentVideos, getShowsDataFromSheets } from '../db'
import './VideoPage.css'
import { YoutubeLinkItem } from './YoutubeLinkItem'
export function HomePage() {
    const { data: shows, isLoading } = useQuery({
        queryFn: () => getShowsDataFromSheets(),
        queryKey: ['shows'],
    })

    const { data: recentVideos } = useQuery({
        queryFn: () => getRecentVideos(5),
        queryKey: ['recentVideos'],
    })
    return (
        <div>
            <Header></Header>
            <div style={{ padding: '0 1rem' }}>
                <h3 style={{ padding: '0 1rem' }}>Tónleikar á næstunni</h3>
                <div
                    className="related-videos"
                    // style={{ display: 'flex', flexDirection: 'row' }}
                >
                    {/* {JSON.stringify(shows)} */}
                    {shows?.map((show) => {
                        return (
                            <button
                                className="card"
                                style={{
                                    display: 'block',
                                    minHeight: '200px',
                                    minWidth: '300px',
                                    // backgroundColor: 'var(--accent-color)',
                                    flexGrow: 1,
                                }}
                            >
                                <h2>{show.bands.join(', ')}</h2>
                                <h2>{show.venue}</h2>
                                <i>
                                    {show.date.toLocaleDateString('is-IS', {
                                        dateStyle: 'full',
                                    })}
                                    {/* {show.date.toLocaleDateString()} */}
                                </i>
                            </button>
                        )
                    })}
                </div>
            </div>
            {/* <div style={{ padding: '0 1rem' }}> */}
            <div style={{ padding: '0 1rem' }}>
                <h3>Nýleg myndbönd </h3>
                <div
                    className="related-videos"
                    // style={{
                    // }}
                >
                    {recentVideos
                        .filter(
                            (video) =>
                                ![
                                    'Grit Teeth',
                                    'Dulvitund',
                                    'Une Misére',
                                ].includes(video.band)
                        )
                        .map((video) => {
                            return (
                                <div
                                    key={video.video_id}
                                    style={{ display: 'block', width: '300px' }}
                                >
                                    <YoutubeLinkItem video={video} />
                                </div>
                            )
                        })}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage
