function MessagesBlurb({ stats }) {

    const getBlurb = (stats) => {
        if (!stats.num_msgs || stats.num_msgs.length === 0) {
            return <div>No message data available</div>
        }

        // Calculate average
        const avg = (stats.num_msgs.reduce((sum, v) => sum + v, 0) / stats.num_msgs.length).toFixed(1)
        
        // Calculate max
        const max = Math.max(...stats.num_msgs)
        
        // Calculate mode (most common value)
        const frequency = {}
        stats.num_msgs.forEach(num => {
            frequency[num] = (frequency[num] || 0) + 1
        })
        const mode = Object.keys(frequency).reduce((a, b) => 
            frequency[a] > frequency[b] ? a : b
        )

        // Calculate average
        const avg_words = (stats.num_words.reduce((sum, v) => sum + v, 0) / stats.num_words.length).toFixed(1)
        
        // Calculate max
        const max_words = Math.max(...stats.num_words)
        
        // Calculate mode (most common value)
        const frequency_words = {}
        stats.num_words.forEach(num => {
            frequency_words[num] = (frequency_words[num] || 0) + 1
        })
        const mode_words = Object.keys(frequency_words).reduce((a, b) =>
            frequency_words[a] > frequency_words[b] ? a : b
        )
        return (
            <div>
                <div className="mb-4 text-base text-[var(--hwhite)]">
                    You didn't send anything for <strong className="text-[var(--red)]">{stats.matched_no_chat}</strong> matches, 
                    but when you did you sent an average of <strong className="text-[var(--lime)]">{avg}</strong> messages with an average of <strong className="text-[var(--lime)]">{avg_words}</strong> words per message.<br /><br />
                    
                    The most messages you sent in one chat was <strong className="text-[var(--orange)]">{max}</strong> and the most words you sent in one message was <strong className="text-[var(--orange)]">{max_words}</strong>.<br /><br />
                    
                    Your most common chat length was <strong className="text-[var(--blue)]">{mode}</strong> messages.
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

export default MessagesBlurb

