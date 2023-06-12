import { Link } from '@tanstack/react-location'
import { YoutubeThumbnail } from './YoutubeThumbnail'

export function YoutubeLinkItem({ video }) {
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
                    <YoutubeThumbnail youtubeId={video.url} showThumbnail />
                    <div
                        className="thumbnail-info"
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
                                {new Date(video.date).toLocaleDateString(
                                    'is-IS',
                                    {
                                        dateStyle: 'long',
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
}
