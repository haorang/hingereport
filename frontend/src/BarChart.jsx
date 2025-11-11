import { ResponsiveBar } from '@nivo/bar'

function BarChart({ stats, timeZone }) {
    if (!stats || !stats.likes_by_hr || !stats.matches_by_like_hr) {
        return <div>No data available</div>
    }

    // Calculate timezone offset in hours
    const getTimezoneOffset = (tz) => {
        if (!tz) return 0
        // Create a date in UTC and in the target timezone
        const now = new Date()
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
        const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }))
        // Offset in hours
        return Math.round((tzDate - utcDate) / (1000 * 60 * 60))
    }

    const offset = getTimezoneOffset(timeZone)

    // Transform the data into Nivo format
    const data = stats.likes_by_hr.map((likes, utcHour) => {
        const matches = stats.matches_by_like_hr[utcHour]
        const noMatches = likes - matches
        
        // Adjust hour by timezone offset, wrapping around 0-23
        const adjustedHour = (utcHour + offset + 24) % 24
        
        return {
            hour: (() => {
                // Format hour as "12am", "1am", ..., "12pm", "1pm", ..., "11pm"
                const h = adjustedHour % 24
                if (h === 0) return "12 AM"
                if (h === 12) return "12 PM"
                if (h < 12) return `${h} AM`
                return `${h-12} PM`
            })(),
            i: adjustedHour,
            utcHour, // Keep track for sorting
            "Sent like and matched": matches,
            "Sent like and no match": noMatches,
            "Sent like and matchedColor": "var(--light-green)",
            "Sent like and no matchColor": "var(--light-blue)"
        }
    })

    // Sort by adjusted hour to display in correct order (reverse for horizontal layout)
    data.sort((a, b) => b.i - a.i)

    return (
        <div style={{ height: '600px', width: '100%' }}>
            <ResponsiveBar
                data={data}
                keys={['Sent like and matched', 'Sent like and no match']}
                indexBy="hour"
                layout="horizontal"
                margin={{ top: 50, right: 40, bottom: 50, left: 60 }}
                padding={0.1}
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={({
                    id,
                    data
                  }) => String(data[`${id}Color`])}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                }}
                enableGridY={false}
                enableGridX={false}
                enableTotals={true}
                enableLabel={false}
                label={d => {
                    if (d.id === 'Sent like and matched') {
                        return `${d.value}`
                    } else {
                        return ``
                    }
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Likes Sent',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legendPosition: 'middle',
                    legendOffset: -40,
                    tickValues: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
                    // format: (value) => {
                    //     // Format numeric hour as "12am", "1am", etc.
                    //     const h = value % 24
                    //     if (h === 0) return "12 AM"
                    //     if (h === 12) return "12 PM"
                    //     if (h < 12) return `${h} AM`
                    //     return `${h-12} PM`
                    // }
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                // labelTextColor={{
                //     from: 'color',
                //     modifiers: [['darker', 1.6]]
                // }}
                // legends={[
                //     {
                //         dataFrom: 'keys',
                //         anchor: 'bottom-right',
                //         direction: 'column',
                //         justify: false,
                //         translateX: 120,
                //         translateY: 0,
                //         itemsSpacing: 2,
                //         itemWidth: 100,
                //         itemHeight: 20,
                //         itemDirection: 'left-to-right',
                //         itemOpacity: 0.85,
                //         symbolSize: 20,
                //         effects: [
                //             {
                //                 on: 'hover',
                //                 style: {
                //                     itemOpacity: 1
                //                 }
                //             }
                //         ]
                //     }
                // ]}
                role="application"
                ariaLabel="Likes by hour bar chart"
                tooltip={({ indexValue, value, id, color, data }) => {
                    // indexValue is the formatted string like "12 AM", use data.hour instead
                    const formattedHour = data.hour || indexValue
                    
                    return (
                        <div style={{ 
                            background: '#000', 
                            color: '#fff', 
                            padding: '8px 12px', 
                            borderRadius: '4px', 
                            fontSize: '13px',
                            fontFamily: 'ModernEra, Arial, sans-serif',
                            minWidth: '220px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontWeight: 600, marginBottom: '6px' }}>{formattedHour}</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <div style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    backgroundColor: color, 
                                    borderRadius: '2px',
                                    flexShrink: 0
                                }}></div>
                                <span style={{ fontSize: '13px' }}>{id}:</span>
                                <span style={{ fontSize: '13px', fontWeight: 700 }}>{value}</span>
                            </div>
                        </div>
                    )
                }}
            />
        </div>
    )
}

export default BarChart

