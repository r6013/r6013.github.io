import { Link, MakeGenerics } from '@tanstack/react-location'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getShowsDataFromSheets } from '../db'
type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type showType = ArrayElement<Awaited<ReturnType<typeof getShowsDataFromSheets>>>
type showGenerics = MakeGenerics<{
    LoaderData: { show: showType }
}>

export function ShowCardAlternate({ show }: { show: showType }) {
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
        <Link
            to={`/shows/${show.id}`}
            // search={(old) => ({ ...old, showId: show.id })}
            // onClick={() => {
            //     const el = document.getElementById(
            //         show.name
            //     ) as HTMLDialogElement
            //     el.showModal()
            // }}
            className="card button"
            style={{
                display: 'flex',
                // flexDirection: 'column',
                // justifyContent: 'space-between',
                minHeight: '200px',
                minWidth: '300px',
                padding: 0,
                borderRadius: '10px',
                // backgroundColor: 'var(--accent-color)',
                flexGrow: 1,
            }}
            key={show.name}
        >
            {/* <div style={{ width: '300px', height: '600px' }}> */}
            {/* <div style={{ maxWidth: '100%' }}> */}
            {/* <div> */}
            <img
                src={show.image}
                alt=""
                // width={'200px'}
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                }}
            />
            {/* </div> */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    padding: '0.2rem',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    width: 'calc(100% - 0.4rem)',
                    backdropFilter: 'blur(3px)',
                    borderRadius: '10px',
                }}
            >
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
                {/* </div> */}
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
            </div>
            {/* </div> */}
        </Link>
    )
}
