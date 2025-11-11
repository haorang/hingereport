import { useState } from 'react'
import SankeyDiagram from './SankeyDiagram'
function MatchesData({ stats }) {

    const getBlurb = (stats) => {

        const matchRate = (stats.match_from_like / stats.like) * 100
        const incomingMatchRate = (stats.incoming_like_match / (stats.incoming_like_x + stats.incoming_like_match)) * 100

        const matchOdds = (stats.like / stats.match_from_like).toFixed(0)
        return (
            
            <div>
                <div className="mb-4 text-base text-[var(--hblack)]">
                    You interacted with <strong className="text-[var(--blue)]">{stats.total_interactions}</strong> people, 
                    matching with <strong className="text-[var(--lime)]">{stats.match} </strong> 
                    ({((stats.match / stats.total_interactions) * 100).toFixed(2)}%) of them.<br /><br />
                    You received <strong className="text-[var(--cyan)]">{stats.incoming_like_x + stats.incoming_like_match}</strong> likes 
                    which led to <strong className="text-[var(--lime)]">{stats.incoming_like_match}</strong> ({incomingMatchRate.toFixed(2)}%) matches. 
                    <br /><br />
                    You sent <strong className="text-[var(--blue)]">{stats.like}</strong> likes 
                    which led to <strong className="text-[var(--lime)]">{stats.match_from_like}</strong> ({matchRate.toFixed(2)}%)  matches. 
                    Nice, that's about 1 in {matchOdds}, which is not bad for finding romantic fulfillment. 

                </div>
            </div>
        )
    }

    return (
        <div className="w-full border-2 border-[var(--hblack)] rounded-lg">
            <SankeyDiagram stats={stats} />
        </div>
    )
}

export default MatchesData