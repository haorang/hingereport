function MatchesBlurb({ stats, dateRange }) {

    const getBlurb = (stats) => {

        const matchRate = (stats.match_from_like / stats.like) * 100
        const incomingMatchRate = (stats.incoming_like_match / (stats.incoming_like_x + stats.incoming_like_match)) * 100

        const matchOdds = (stats.like / stats.match_from_like).toFixed(0)
        let matchesPerDay = null
        if (dateRange && dateRange.end && dateRange.start) {
            const days = (new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24)
            matchesPerDay = (stats.total_interactions / days).toFixed(1)
        }
        return (
            
            <div>
                {dateRange && dateRange.end && dateRange.start &&
                (<div className="mb-4 text-base text-[var(--hwhite)]">
                    You interacted with <strong className="text-[var(--blue)]">{stats.total_interactions}</strong> people, about <strong className="">{matchesPerDay}</strong> per day, 
                    matching with <strong className="text-[var(--lime)]">{stats.match} </strong> 
                    ({((stats.match / stats.total_interactions) * 100).toFixed(2)}%) of them and said you met with <strong className="text-[var(--pink)]">{stats.we_met} </strong> of them.<br /><br />
                    You received <strong className="text-[var(--cyan)]">{stats.incoming_like_x + stats.incoming_like_match}</strong> likes 
                    which led to <strong className="text-[var(--lime)]">{stats.incoming_like_match}</strong> ({incomingMatchRate.toFixed(2)}%) matches. 
                    <br /><br />
                    You sent <strong className="text-[var(--blue)]">{stats.like}</strong> likes 
                    which led to <strong className="text-[var(--lime)]">{stats.match_from_like}</strong> ({matchRate.toFixed(2)}%)  matches, 
                    or about 1 in {matchOdds}. 

                </div>)
    }
            </div>
        )
    }

    return (
        <div className="w-full p-4 rounded-lg bg-[var(--hblack)] border-2 border-[var(--hwhite)]">
            {getBlurb(stats)}
        </div>
    )
}

export default MatchesBlurb