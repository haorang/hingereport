import WordCloudViz from './WordCloudViz'

function MessagesData({ stats, isDark }) {
    return (
        <div className="w-full border-2 border-[var(--hblack)] dark:border-[var(--hwhite)] rounded-lg bg-white dark:bg-[var(--hblack)]">
            <WordCloudViz wordFrequency={stats.word_frequency} isDark={isDark} />
        </div>
    )
}

export default MessagesData

