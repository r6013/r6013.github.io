import { useEffect, useState } from 'react'
import { Header } from './Header'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { searchBands, searchVideos } from '../db'
import { Link, useNavigate, useSearch } from '@tanstack/react-location'
import { YoutubePlayer } from './YoutubePlayer'
import { VideoListItem } from './VideoListItem'
import { Footer } from './Footer'
import './VideoListPage.css'
import { YoutubeThumbnail } from './YoutubeThumbnail'

export function VideoListPage() {
    const navigate = useNavigate()
    const searchParams = useSearch()
    const [searchValue, setSearchValue] = useState('')
    useEffect(() => {
        setTimeout(() => {
            setSearchValue(searchParams.query ?? '')
        }, 50)
    }, [])
    const handleSearch = (searchValue: string) => {
        setSearchValue(searchValue)
        navigate({
            search: (old) => ({ ...old, query: searchValue }),
            replace: true,
        })
    }

    const { data: videos, isLoading } = useQuery({
        queryFn: () => searchVideos({ searchQuery: searchValue }),
        queryKey: ['videos', searchValue],
    })
    // if (isLoading) {
    //     return
    // }
    return (
        <>
            <Header>
                <div
                    className="search"
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <input
                        onChange={(event) => handleSearch(event.target.value)}
                        type="search"
                        placeholder="Leita að myndbandi"
                        value={searchValue}
                        // style={{ height: '100%' }}
                        // ref={inputRef}
                    />
                </div>
            </Header>
            {videos && (
                <div className="video-grid">
                    {videos
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
                                <Link to={`/videos/${video.video_id}`}>
                                    <div>
                                        <div
                                            style={{
                                                position: 'relative',
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        >
                                            <YoutubeThumbnail
                                                youtubeId={video.url}
                                                showThumbnail
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    color: 'white',
                                                    padding: '1rem',
                                                }}
                                            >
                                                <h2
                                                    style={{
                                                        padding: 0,
                                                        margin: '0.3rem 0',
                                                    }}
                                                >
                                                    {video.band}
                                                </h2>
                                                <div>
                                                    <div>{video.venue}</div>
                                                    <div>
                                                        {new Date(
                                                            video.date
                                                        ).toLocaleDateString(
                                                            'is',
                                                            {
                                                                dateStyle:
                                                                    'medium',
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <VideoListItem
                                    key={video.video_id}
                                    video={video}
                                /> */}
                                </Link>
                            )
                        })}
                </div>
            )}
            <Footer />
        </>
    )
}
