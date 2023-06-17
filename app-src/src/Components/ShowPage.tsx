import { MakeGenerics, useMatch } from '@tanstack/react-location'
import { Header } from './Header'
import { Footer } from './Footer'
import { getShowsDataFromSheets } from '../db'
import { useTranslation } from 'react-i18next'
type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never

type showType = ArrayElement<Awaited<ReturnType<typeof getShowsDataFromSheets>>>
type showGenerics = MakeGenerics<{
    LoaderData: { show: showType }
}>
export function ShowPage() {
    const { t, i18n, ready } = useTranslation()
    const {
        data: { show },
    } = useMatch<showGenerics>()
    return (
        <>
            <Header></Header>
            <h1>{show?.name}</h1>
            <p>{show?.bands.join(', ')}</p>
            <p>
                {show?.date.toLocaleDateString(i18n.language, {
                    dateStyle: 'medium',
                })}
            </p>
            <img src={show?.image} alt="" />
            <div>{JSON.stringify(show)}lol</div>
            <Footer></Footer>
        </>
    )
}
