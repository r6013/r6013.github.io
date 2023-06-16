import { Header } from './Header'
import './Home.css'
import { Footer } from './Footer'
import './VideoPage.css'
import { YoutubeLinkItem } from './YoutubeLinkItem'
import { useTranslation } from 'react-i18next'
import { MakeGenerics, useMatch } from '@tanstack/react-location'
import { useEffect, useState } from 'react'
import { Carousel } from './Carousel'
type loaderGenerics = MakeGenerics<{
    LoaderData: {
        shows: {
            name: string
            date: Date
            bands: string[]
            venue: string
            image: string
        }[]
        recentVideos: {
            band: string
            members: { name: string; id: string | number }
            video_id: string | number
            show_id: string | number
            url: string
            band_id: string | number
            venue: string
            date: string | Date
        }[]
    }
}>

export function ShowCard({
    show,
}: {
    show: {
        name: string
        date: Date
        bands: string[]
        venue: string
        image: string
    }
}) {
    const { t, i18n, ready } = useTranslation()
    const [aspectRatio, setAspectRatio] = useState('')
    useEffect(() => {
        const img = new Image()
        img.src = show.image
        setAspectRatio(img.width > img.height ? 'landscape' : 'portrait')
    }, [])

    const [daysUntilShow, setDaysUntilShow] = useState(
        Number(((show.date - new Date()) / (1000 * 60 * 60 * 24)).toFixed(0))
    )
    const [showDatePassed, setShowDatePassed] = useState(daysUntilShow < 0)

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
                key={show.name}
            >
                <div style={{ maxWidth: '100%' }}>
                    <img
                        src={show.image}
                        alt=""
                        width={'200px'}
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <h2>{show.bands.join(', ')}</h2>
                <h2>{show.venue}</h2>
                <i>
                    {show.date.toLocaleDateString(i18n.language, {
                        dateStyle: 'full',
                    })}
                    {/* {show.date.toLocaleDateString()} */}
                </i>
                <p>
                    {showDatePassed
                        ? t('days_since_show', {
                              count: Math.abs(daysUntilShow),
                          })
                        : t('days_until_show', { count: daysUntilShow })}
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
                    const dialog = document.getElementById(
                        show.name
                    ) as HTMLDialogElement
                    if (ev.target == dialog) {
                        dialog.close()
                    }
                }}
                style={{ maxHeight: '70vh', maxWidth: '70vw' }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection:
                            aspectRatio == 'landscape' ? 'column' : 'row',
                    }}
                >
                    <div
                        style={{
                            maxWidth: '60%',
                            maxHeight: '60%',
                            display: 'grid',
                            placeItems: 'center',
                            margin: 'auto',
                        }}
                    >
                        <img
                            src={show.image}
                            alt=""
                            style={{
                                // maxWidth: '60%',
                                // maxHeight: '60%',
                                objectFit: 'scale-down',
                                maxWidth: '90%',
                                maxHeight: '90%',
                                outline: '1px solid black',
                            }}
                        />
                    </div>
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
                            {show.date.toLocaleDateString(i18n.language, {
                                dateStyle: 'medium',
                            })}
                        </p>
                        <p>
                            {show.bands.join(', ')} @ {show.venue}
                        </p>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export function HomePage() {
    const {
        data: { shows, recentVideos },
    } = useMatch<loaderGenerics>()

    const { t, i18n, ready } = useTranslation()

    return (
        <div>
            <Header></Header>

            <div style={{ padding: '0 1rem' }}>
                <h3
                    style={{
                        padding: '0 1rem',
                    }}
                >
                    {t('upcoming_shows')}
                </h3>
                <Carousel>
                    {shows
                        ?.filter((show) => show.date > new Date())
                        .map((show, idx) => {
                            return <ShowCard show={show} />
                        })}
                </Carousel>

                <div style={{ padding: '0 1rem' }}>
                    <h3 style={{ padding: '0 1rem' }}>{t('recent_shows')}</h3>
                    <Carousel>
                        {/* {JSON.stringify(shows)} */}
                        {shows
                            ?.filter((show) => show.date < new Date())
                            .sort((a, b) => b.date - a.date)
                            .map((show, idx) => {
                                return <ShowCard show={show} />
                            })}
                    </Carousel>
                </div>
            </div>
            <div style={{ padding: '0 1rem' }}>
                <h3>{t('recent_videos')}</h3>
                <Carousel>
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
                </Carousel>
            </div>
            <Footer />
        </div>
    )
}

export default HomePage
