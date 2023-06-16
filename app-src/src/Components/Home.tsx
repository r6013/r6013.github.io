import { Header } from './Header'
import './Home.css'
import { Footer } from './Footer'
import { useQuery } from '@tanstack/react-query'
import { getRecentVideos, getShowsDataFromSheets } from '../db'
import './VideoPage.css'
import { YoutubeLinkItem } from './YoutubeLinkItem'
import { useTranslation } from 'react-i18next'
import { useMatch } from '@tanstack/react-location'
export function HomePage() {
    // const { data: shows, isLoading } = useQuery({
    //     queryFn: () => getShowsDataFromSheets(),
    //     queryKey: ['shows'],
    // })

    // const { data: recentVideos } = useQuery({
    //     queryFn: () => getRecentVideos(5),
    //     queryKey: ['recentVideos'],
    // })

    const {
        data: { shows, recentVideos },
    } = useMatch()

    const { t, i18n, ready } = useTranslation()

    return (
        <div>
            <Header></Header>

            <div style={{ padding: '0 1rem' }}>
                <h3 style={{ padding: '0 1rem' }}>{t('upcoming_shows')}</h3>
                <div
                    className="related-videos"
                    // style={{ display: 'flex', flexDirection: 'row' }}
                >
                    {/* {JSON.stringify(shows)} */}
                    {shows
                        ?.filter((show) => show.date > new Date())
                        .map((show, idx) => {
                            return (
                                <>
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById(
                                                show.name
                                            ) as HTMLDialogElement
                                            el.showModal()
                                        }}
                                        className="card"
                                        style={{
                                            display: 'block',
                                            minHeight: '200px',
                                            minWidth: '300px',
                                            // backgroundColor: 'var(--accent-color)',
                                            flexGrow: 1,
                                        }}
                                        key={show.name + idx}
                                    >
                                        <h2>{show.bands.join(', ')}</h2>
                                        <h2>{show.venue}</h2>
                                        <i>
                                            {show.date.toLocaleDateString(
                                                i18n.language,
                                                {
                                                    dateStyle: 'full',
                                                }
                                            )}
                                            {/* {show.date.toLocaleDateString()} */}
                                        </i>
                                        <p>
                                            {t('days_until_show', { count: 5 })}
                                            {/* Eftir{' '}
                                            {(
                                                (show.date - new Date()) /
                                                (1000 * 60 * 60 * 24)
                                            ).toFixed(0)}{' '}
                                            daga */}
                                        </p>
                                    </button>
                                    <dialog
                                        id={`${show.name}`}
                                        onClick={(ev) => {
                                            const dialog =
                                                document.getElementById(
                                                    show.name
                                                ) as HTMLDialogElement
                                            if (ev.target == dialog) {
                                                dialog.close()
                                            }
                                        }}
                                        style={{ maxWidth: '70vw' }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <img
                                                src={show.image}
                                                alt=""
                                                style={{
                                                    maxWidth: '60%',
                                                    outline: '1px solid black',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    // textAlign: 'center',
                                                    // marginLeft: 'auto',
                                                    // marginRight: 'auto',
                                                    padding: '1rem',
                                                }}
                                            >
                                                <h2
                                                    style={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {show.venue}
                                                </h2>
                                                <p>
                                                    {show.date.toLocaleDateString(
                                                        i18n.language,
                                                        { dateStyle: 'medium' }
                                                    )}
                                                </p>
                                                <p>
                                                    {show.bands.join(', ')} @{' '}
                                                    {show.venue}
                                                </p>
                                            </div>
                                        </div>
                                    </dialog>
                                </>
                            )
                        })}
                </div>
            </div>
            <div style={{ padding: '0 1rem' }}>
                <h3 style={{ padding: '0 1rem' }}>{t('recent_shows')}</h3>
                <div
                    className="related-videos"
                    // style={{ display: 'flex', flexDirection: 'row' }}
                >
                    {/* {JSON.stringify(shows)} */}
                    {shows
                        ?.filter((show) => show.date < new Date())
                        .sort((a, b) => b.date - a.date)
                        .map((show, idx) => {
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
                                    key={show.name + idx}
                                >
                                    <h2>{show.bands.join(', ')}</h2>
                                    <h2>{show.venue}</h2>
                                    <i>
                                        {show.date.toLocaleDateString(
                                            i18n.language,
                                            {
                                                dateStyle: 'full',
                                            }
                                        )}
                                        {/* {show.date.toLocaleDateString()} */}
                                    </i>
                                </button>
                            )
                        })}
                </div>
            </div>
            {/* <div style={{ padding: '0 1rem' }}> */}
            <div style={{ padding: '0 1rem' }}>
                <h3>{t('recent_videos')}</h3>
                <div
                    className="related-videos"
                    // style={{
                    // }}
                >
                    {recentVideos
                        ?.filter(
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
