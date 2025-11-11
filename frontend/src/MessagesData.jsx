import WordCloudViz from './WordCloudViz'

function MessagesData({ stats }) {
    return (
        <div className="w-full border-2 border-[var(--hblack)] rounded-lg bg-white">
            <WordCloudViz wordFrequency={stats.word_frequency} />
        </div>
    )
}

export default MessagesData

