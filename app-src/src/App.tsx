import { useState, useEffect, Suspense } from 'react'
import { ThemeContext } from './Components/ThemeContext'
import SignPage from './Components/SignPage'
import HomePage from './Components/Home'
import { VideoListPage } from './Components/VideoListPage'
import {
    query,
    getVideoById,
    getRandomVideo,
    getShowById,
    getShowByVideoId,
    getBandsVideosByVideoId,
} from './db'
import {
    ReactLocation,
    Router,
    Outlet,
    Navigate,
} from '@tanstack/react-location'

import PlaceholderScreen from './Components/PlaceholderScreen'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppNavBar } from './Components/AppNavBar'
import { DarkModeSwitch } from './Components/DarkModeSwitch'
import { NotFound } from './Components/NotFound'
import { RandomVideo } from './Components/RandomVideo'
import { MyLocationGenerics } from './Components/Generics'
import { RawSql } from './Components/RawSql'
import { GetCollections } from './Components/GetCollections'
import { Footer } from './Components/Footer'
import { Header } from './Components/Header'
import { VideoPage } from './Components/VideoPage'
import { SheetsTest } from './Components/SheetsTest'
import { NotionTest } from './Components/NotionTest'
import { useTranslation } from 'react-i18next'

const reactLocation = new ReactLocation()

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime: 1000 * 60 * 5,
            networkMode: 'offlineFirst',
        },
    },
})

function App() {
    const { t, i18n, ready } = useTranslation()
    const [standalone, setStandalone] = useState(false)
    useEffect(() => {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setStandalone(true)
        }
    })
    const [promiseWorkerLoaded, setPromiseWorkerLoaded] = useState(false)
    const [currentTheme, setCurrentTheme] = useState(
        window.localStorage.getItem('theme_mode') ?? 'light'
    )
    useEffect(() => {
        const intervalID = setInterval(() => {
            console.log('callback yo')
            try {
                query('select * from band_member limit 5').then((res: any) => {
                    if (res[0]) {
                        clearInterval(intervalID)
                        setPromiseWorkerLoaded(true)
                        console.log('promise worker loaded')
                    }
                })
            } catch (error) {
                console.error(error)
            }
        }, 500)
    }, [])

    if (!promiseWorkerLoaded) {
        return
        return <PlaceholderScreen />
    }
    return (
        <Suspense>
            <QueryClientProvider client={queryClient}>
                <ThemeContext.Provider
                    value={{ currentTheme, setCurrentTheme }}
                >
                    <Router
                        location={reactLocation}
                        basepath="/"
                        // defaultLinkPreloadMaxAge={Infinity}
                        // defaultPendingElement={<PlaceholderScreen />}
                        // defaultLoaderMaxAge={Infinity}
                        routes={[
                            {
                                path: '/',
                                element: <HomePage />,
                                // element: <Navigate to={'/videos'} />,
                            },
                            {
                                path: 'home',
                                element: <HomePage />,
                            },
                            {
                                path: 'random',
                                element: <RandomVideo />,

                                loader: async () => ({
                                    videoId: await getRandomVideo(),
                                }),
                            },
                            {
                                path: 'videos',
                                children: [
                                    {
                                        path: '/',
                                        element: <VideoListPage />,
                                    },
                                    {
                                        path: ':id',
                                        element: <VideoPage />,

                                        loader: async ({ params }) => ({
                                            video: await getVideoById(
                                                params.id
                                            ),
                                            show: await getShowByVideoId(
                                                params.id
                                            ),
                                            bandVideos:
                                                await getBandsVideosByVideoId(
                                                    params.id
                                                ),
                                        }),
                                    },
                                ],
                            },

                            {
                                path: 'sql',
                                element: <RawSql />,
                            },
                            {
                                path: 'default-collections',
                                element: <GetCollections />,
                            },
                            {
                                path: 'sheetstest',
                                element: <SheetsTest />,
                            },
                            {
                                path: 'notiontest',
                                element: <NotionTest />,
                            },
                            {
                                // Passing no route is equivalent to passing `path: '*'`
                                element: <NotFound />,
                            },
                        ]}
                    >
                        <Outlet />
                        {/* <AppNavBar type="footer" /> */}
                        {/* <div
                            className="dark-mode-switch-container"
                            style={{
                                position: 'fixed',
                                top: 'env(safe-area-inset-top)',
                                right: '0',
                                padding: '1rem',
                                zIndex: 9999,
                            }}
                        >
                            <DarkModeSwitch setCurrentTheme={setCurrentTheme} />
                        </div> */}

                        <dialog
                            id="app-save-modal"
                            onClick={(ev) => {
                                const dialog = document.getElementById(
                                    'app-save-modal'
                                ) as HTMLDialogElement
                                if (ev.target == dialog) {
                                    dialog.close()
                                }
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '2rem',
                                    maxWidth: '70vw',
                                }}
                            >
                                <form method="dialog" style={{}}>
                                    <button style={{ maxWidth: '2rem' }}>
                                        x
                                    </button>
                                </form>
                                <div>
                                    <h3>{t('directions_save_app_heading')}</h3>
                                    <p>{t('directions_save_app_intro')}</p>
                                    <p>
                                        <b>iPhone:</b>{' '}
                                        {t('directions_save_app_iphone')}
                                    </p>
                                    <p>
                                        <b>Android:</b>{' '}
                                        {t('directions_save_app_android')}
                                    </p>
                                </div>
                            </div>
                        </dialog>
                    </Router>
                </ThemeContext.Provider>
            </QueryClientProvider>
        </Suspense>
    )
}

export default App
