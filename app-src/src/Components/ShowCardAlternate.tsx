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
            <img
                src={show.image}
                alt=""
                style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    padding: '0.2rem',
                    backgroundColor: 'rgba(200,200,200,0.5)',
                    width: 'calc(100% - 0.4rem)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: '10px',
                }}
            >
                <h2>{show.bands.join(', ')}</h2>
                <h2>{show.venue}</h2>
                <i>
                    {show.date.toLocaleDateString(i18n.language, {
                        dateStyle: 'full',
                    })}
                </i>
                <p>
                    {showDatePassed
                        ? t('days_since_show', {
                              count: Math.abs(daysUntilShow),
                          })
                        : t('days_until_show', { count: daysUntilShow })}
                </p>
            </div>
        </Link>
    )
}
