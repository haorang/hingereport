function LikesBlurb({ stats, timeZone }) {

    const getBlurb = (stats) => {

        const matchRate = (stats.match_from_like / stats.like) * 100
        const incomingMatchRate = (stats.incoming_like_match / (stats.incoming_like_x + stats.incoming_like_match)) * 100

        const matchWithMsgRate = (stats.match_from_like_with_msg / stats.like_sent_with_msg) * 100
        const matchNoMsgRate = (stats.match_from_like_no_msg / stats.like_sent_no_msg) * 100


        // Calculate timezone offset
        const getTimezoneOffset = (tz) => {
            if (!tz) return 0
            const now = new Date()
            const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
            const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }))
            return Math.round((tzDate - utcDate) / (1000 * 60 * 60))
        }
        const offset = getTimezoneOffset(timeZone)

        // Calculate match rate per hour with count and adjusted hour
        const hourlyData = []
        for (let utcHour = 0; utcHour < 24; utcHour++) {
            const likes = stats.likes_by_hr[utcHour]
            const matches = stats.matches_by_like_hr[utcHour]
            const adjustedHour = (utcHour + offset + 24) % 24
            
            hourlyData.push({
                utcHour,
                adjustedHour,
                likes,
                matches,
                matchRate: likes > 0 ? (matches / likes) * 100 : 0
            })
        }

        // Sort by likes count and exclude bottom 6
        const sortedByCount = [...hourlyData].sort((a, b) => b.likes - a.likes)
        const topHours = sortedByCount.slice(0, 18) // Exclude bottom 6

        // Sort by match rate to get top 3 and bottom 3
        const sortedByMatchRate = [...topHours].sort((a, b) => b.matchRate - a.matchRate)
        const top3Hours = sortedByMatchRate.slice(0, 3)
        const bottom3Hours = sortedByMatchRate.slice(-3).reverse() // Reverse to show worst first

        // Format hour as "12am", "1am", etc.
        const formatHour = (h) => {
            if (h === 0) return "12am"
            if (h === 12) return "12pm"
            if (h < 12) return `${h}am`
            return `${h-12}pm`
        }

                
        return (
            
            <div>
                <div className="mb-4 text-base text-[var(--hwhite)] ">
                    You sent <strong className="text-[var(--blue)]">{stats.like_sent_with_msg}</strong> likes with a message, 
                    leading to <strong className="text-[var(--lime)]">{stats.match_from_like_with_msg} </strong>
                    ({matchWithMsgRate.toFixed(2)}%) matches.<br /><br />
                    You sent <strong className="text-[var(--blue)]">{stats.like_sent_no_msg}</strong> likes without a message, 
                    leading to <strong className="text-[var(--lime)]">{stats.match_from_like_no_msg} </strong>
                    ({matchNoMsgRate.toFixed(2)}%) matches.<br /><br />
                    
                    <div className="t text-[var(--hwhite)] font-modernera ">Hours with best like success rate:</div>
                    {top3Hours.map((hour, idx) => (
                        <span key={idx}>
                            {idx + 1}. 
                            <span className="font-modernera "> {formatHour(hour.adjustedHour)}</span> - 
                            <span className="text-[var(--green)] font-modernera font-bold"> {hour.matchRate.toFixed(1)}% </span> 
                            ({hour.matches}/{hour.likes})<br />
                        </span>
                    ))}
                    <br />
                    <div className="t text-[var(--hwhite)] font-modernera ">worst hours:</div>
                    {bottom3Hours.map((hour, idx) => (
                        <span key={idx}>
                            {idx + 1}.
                            <span className="font-modernera "> {formatHour(hour.adjustedHour)}</span> - 
                            <span className="text-[var(--red)] font-modernera font-bold"> {hour.matchRate.toFixed(1)}% </span> 
                            ({hour.matches}/{hour.likes})<br />
                        </span>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full p-4 rounded-lg bg-[var(--hblack)] border-2 border-[var(--hwhite)]">
            {getBlurb(stats)}
        </div>
    )
}

export default LikesBlurb