const DB_CONSOLE_LOGS = true
const query = async (query: string) => {
    DB_CONSOLE_LOGS && console.log(query)
    const result = await window.promiseWorker.postMessage({
        type: 'sql',
        query: query,
    })
    return result
}

const exec = async (query: string) => {
    DB_CONSOLE_LOGS && console.log(query)

    window.promiseWorker.postMessage({ type: 'exec', query: query })
}

const exportDB = async () => {
    const exportedDB: Uint8Array = await window.promiseWorker.postMessage({
        type: 'export',
    })
    console.log(exportedDB)
    return exportedDB
}

const listDefaultCollections = async () => {
    const defaultCollections = await window.promiseWorker.postMessage({
        type: 'listCollections',
    })
    return defaultCollections
}

export const getBandsVideosByVideoId = async (id: number) => {
    const result = await query(`
        select distinct json_object(
            'band',band.name,
            'members', json_group_array(distinct json_object('name',person.name,'id',person.id)),
            'video_id',video.id,
            'show_id',video.show_id,
            'url',video.url,
            'band_id',video.band_id,
            'venue',venue.venue_name,
            'date',show.date
            ) AS video_json
        FROM video
        JOIN band ON video.band_id = band.id
        LEFT JOIN band_member ON band_member.band_id = band.id
        LEFT JOIN person ON band_member.member_id = person.id
        LEFT JOIN show ON video.show_id = show.id
        LEFT JOIN venue ON venue.id = show.venue_id
        WHERE band.id IN (SELECT band_id FROM video WHERE video.id = ${id})
        GROUP BY video.id
        ORDER BY show.date desc
`)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].video_json))
    return result.map((res) => JSON.parse(res.video_json))
}

export const getRecentVideos = async (count: number) => {
    const result = await query(`
        select distinct json_object(
            'band',band.name,
            'members', json_group_array(distinct json_object('name',person.name,'id',person.id)),
            'video_id',video.id,
            'show_id',video.show_id,
            'url',video.url,
            'band_id',video.band_id,
            'venue',venue.venue_name,
            'date',show.date
            ) AS video_json
        FROM video
        JOIN band ON video.band_id = band.id
        LEFT JOIN band_member ON band_member.band_id = band.id
        LEFT JOIN person ON band_member.member_id = person.id
        LEFT JOIN show ON video.show_id = show.id
        LEFT JOIN venue ON venue.id = show.venue_id
        GROUP BY video.id
        ORDER BY show.date desc
        LIMIT ${count}
`)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].video_json))
    return result.map((res) => JSON.parse(res.video_json))
}

export const getShowByVideoId = async (id: number) => {
    const result = await query(`
    SELECT
        distinct json_object(
            'sets', json_group_array(
                    distinct json_object(
                        'band',band.name,
                        'video_id',video.id,
                        'url',video.url,
                        'band_id',video.band_id,
                        'venue',venue.venue_name,
                        'date',show.date
                )),
            'show_id',video.show_id,
            'url',video.url,
            'band_id',video.band_id,
            'venue',venue.venue_name,
            'date',show.date
            ) AS show_json
    FROM video
    JOIN band ON video.band_id = band.id
    LEFT JOIN band_member ON band_member.band_id = band.id
    LEFT JOIN person ON band_member.member_id = person.id
    LEFT JOIN show ON video.show_id = show.id
    LEFT JOIN venue ON venue.id = show.venue_id
    WHERE show.id IN (SELECT show_id FROM video WHERE video.id = ${id})
    GROUP BY show.id
    ORDER BY show.date desc
`)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].show_json))
    return result.map((res) => JSON.parse(res.show_json))[0]
    JSON.parse(result[0].video_json)
}

export const getVideoById = async (id: number) => {
    console.log('getting video by id: ' + id)
    const result = await query(`

        select distinct json_object(
            'band',band.name,
            'members', json_group_array(distinct json_object('name',person.name,'id',person.id)),
            'video_id',video.id,
            'show_id',video.show_id,
            'url',video.url,
            'band_id',video.band_id,
            'venue',venue.venue_name,
            'date',show.date

    ) AS video_json
    FROM video
    JOIN band ON video.band_id = band.id
    LEFT JOIN band_member ON band_member.band_id = band.id
    LEFT JOIN person ON band_member.member_id = person.id
    LEFT JOIN show ON video.show_id = show.id
    LEFT JOIN venue ON venue.id = show.venue_id
    WHERE video.id = ${id}
    `)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].video_json))
    // return result.map((res) => JSON.parse(res.video_json))
    return JSON.parse(result[0].video_json)
}

const searchBands = async ({ searchQuery }: { searchQuery: string }) => {
    const result = await query(`
        select * from band where name like "%${searchQuery}%"
    `)
    DB_CONSOLE_LOGS && console.log(result)
    return result
}

export const searchVideos = async ({
    searchQuery,
}: {
    searchQuery: string
}) => {
    const searchClause = searchQuery
        ? `
    WHERE band.name LIKE "%${searchQuery}%"
    OR venue_name LIKE "%${searchQuery}%"`
        : ''
    const result = await query(`

        select distinct json_object(
            'band',band.name,
            'members', json_group_array(distinct json_object('name',person.name,'id',person.id)),
            'video_id',video.id,
            'show_id',video.show_id,
            'url',video.url,
            'band_id',video.band_id,
            'venue',venue.venue_name,
            'date',show.date
            ) AS video_json
        FROM video
        JOIN band ON video.band_id = band.id
        LEFT JOIN band_member ON band_member.band_id = band.id
        LEFT JOIN person ON band_member.member_id = person.id
        LEFT JOIN show ON video.show_id = show.id
        LEFT JOIN venue ON venue.id = show.venue_id
        ${searchClause}
        GROUP BY video.id
        ORDER BY show.date desc
    `)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].video_json))
    return result.map((res) => JSON.parse(res.video_json))
    JSON.parse(result[0].video_json)
}

export const getShowById = async ({ showId }: { showId: string | number }) => {
    const result = await query(`
        SELECT
            distinct json_object(
                'sets', json_group_array(
                            distinct json_object(
                                'band',band.name,
                                'video_id',video.id,
                                'url',video.url
                            )),
                'show_id',video.show_id,
                'url',video.url,
                'band_id',video.band_id,
                'venue',venue.venue_name,
                'date',show.date
                ) AS show_json
        FROM video
        JOIN band ON video.band_id = band.id
        LEFT JOIN band_member ON band_member.band_id = band.id
        LEFT JOIN person ON band_member.member_id = person.id
        LEFT JOIN show ON video.show_id = show.id
        LEFT JOIN venue ON venue.id = show.venue_id
        WHERE show.id = ${showId}
        GROUP BY video.id
        ORDER BY show.date desc
    `)
    DB_CONSOLE_LOGS && console.log(JSON.parse(result[0].show_json))
    return result.map((res) => JSON.parse(res.show_json))
    JSON.parse(result[0].video_json)
}

export const getRandomVideo = async () => {
    // const res = await query('select count(*) as sign_count from sign')
    // // DB_CONSOLE_LOGS && console.log(res)
    // const count = parseInt(res[0].sign_count)
    // // DB_CONSOLE_LOGS && console.log(count)
    // const index = Math.floor(Math.random() * count)
    // // DB_CONSOLE_LOGS && console.log(index)
    // const signs = await query(`select * from sign limit 1 offset ${index}`)
    const videos = await query(`select * from video order by random() limit 1`)
    DB_CONSOLE_LOGS && console.log(videos[0])
    return videos[0].id
}

export const getShowsDataFromSheets = async () => {
    const A = 1
    const Z = 999
    const range = `Shows!A${A}:Z${Z}`
    const sheetId = '178hiGb8CV0VNdupQZ_Btfmxns4FKjR0zfyi-dweOwFs'
    const apiKey = import.meta.env.VITE_SHEETS_API_KEY
    // let shows = []
    console.log(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
    )
    const shows: {
        name: string
        date: Date
        bands: string[]
        venue: string
    }[] = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`
    )
        .then((res) => res.json())
        .then((data) => {
            console.log({ data })
            const [header, ...rows] = data.values
            console.log({ header, rows })
            return rows.map((row) => {
                return Object.fromEntries(
                    row.map((trash, idx) => {
                        if (header[idx] == 'date') {
                            return [header[idx], new Date(row[idx])]
                        }
                        if (header[idx] == 'bands') {
                            return [header[idx], row[idx].split(',')]
                        }
                        return [header[idx], row[idx]]
                    })
                )
            })
        })
    return shows
}

export { query, exportDB, listDefaultCollections, searchBands }
