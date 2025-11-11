import WordCloud from 'react-d3-cloud'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'

// Define colors outside component to avoid recreation
const COLORS = [
    'var(--blue)',
    'var(--green)',
    'var(--red)',
    'var(--hblack)',
]

// Extended stop words for filtering
const EXTENDED_STOP_WORDS = new Set([
    'like', 'just', 'get', 'got', 'yeah', 'lol', 'haha', 'oh', 'okay', 'ok',
    'know', 'think', 'really', 'want', 'good', 'well', 'see', 'going', 'go',
    'yes', 'no', 'sure', 'cool', 'nice', 'right', 'now', 'one', 'also',
    'much', 'back', 'even', 'still', 'way', 'make', 'thing', 'time', 'people',
    'im', 'ill', 'ive', 'id', 'dont', 'cant', 'wont', 'didnt', 'isnt', 'wasnt',
    'thats', 'whats', 'hows', 'theres', 'youre', 'theyre', 'arent', 'havent',
    'some', 'not', 'too', 'more', 'most', 'very', 'before', 'though', 'lets',
    'hi', 'hello', 'hey', 'how', 'are', 'you', 'i', 'me', 'my', 'mine', 'myself',
    'we', 'us', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself',
    'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself',
    'they', 'them', 'their', 'theirs', 'themselves', 'it', 'its', 'itself',
    'this', 'that', 'these', 'those', 'so', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'could', 'may',
    'might', 'must', 'shall', 'should', 'will', 'would', 'shall', 'should', 'will',
    'would', 'shall', 'should', 'will', 'would', 'shall', 'should', 'will', 'would',
])

function WordCloudViz({ wordFrequency }) {
    const [tooltip, setTooltip] = useState(null)
    const [filterCommon, setFilterCommon] = useState(false)
    const [containerWidth, setContainerWidth] = useState(800)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const containerRef = useRef(null)

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth - 48) // Subtract padding
            }
        }
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    // Track mouse position globally
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])
    
    // Transform word_frequency object into array format for react-d3-cloud
    const data = useMemo(() => {
        if (!wordFrequency || Object.keys(wordFrequency).length === 0) {
            return []
        }
        let entries = Object.entries(wordFrequency)
            .map(([text, value]) => ({ text, value }))
            .sort((a, b) => b.value - a.value)
        
        // Apply extended filtering if toggle is on
        if (filterCommon) {
            entries = entries.filter(({ text }) => !EXTENDED_STOP_WORDS.has(text.toLowerCase()))
        }
        
        return entries.slice(0, 80) // Top 80 words
    }, [wordFrequency, filterCommon])

    if (data.length === 0) {
        return <div className="p-4">No word data available</div>
    }

    const getColor = useCallback((d, index) => {
        return COLORS[index % COLORS.length]
    }, [])

    // Calculate min and max values for scaling
    const { minValue, maxValue } = useMemo(() => {
        if (data.length === 0) return { minValue: 1, maxValue: 1 }
        const values = data.map(d => d.value)
        return {
            minValue: Math.min(...values),
            maxValue: Math.max(...values)
        }
    }, [data])

    const fontSize = useCallback((word) => {
        // Scale font size between 20px and 100px based on the value range
        const minFontSize = 12
        const maxFontSize = 80
        
        // Handle edge case where all values are the same
        if (minValue === maxValue) {
            return (minFontSize + maxFontSize) / 2
        }
        
        // Linear scaling from minValue-maxValue to minFontSize-maxFontSize
        const scale = (word.value - minValue) / (maxValue - minValue)
        const size = minFontSize + scale * (maxFontSize - minFontSize)
        return size
    }, [minValue, maxValue])

    const onWordMouseOver = useCallback((event, d) => {
        // Use the tracked mouse position instead of event coordinates
        setTooltip({
            text: d.text,
            value: d.value
        })
    }, [])

    const onWordMouseOut = useCallback(() => {
        setTooltip(null)
    }, [])

    return (
        <div className="p-6" ref={containerRef}>
            
            <div style={{ position: 'relative', width: '100%', minHeight: '500px' }}>
                <WordCloud
                    data={data}
                    width={Math.max(300, containerWidth)}
                    height={600}
                    font="ModernEra, Arial, sans-serif"
                    fontWeight={700}
                    fontSize={fontSize}
                    spiral="archimedean"
                    rotate={0}
                    padding={5}
                    fill={getColor}
                    onWordMouseOver={onWordMouseOver}
                    onWordMouseOut={onWordMouseOut}
                />
                {tooltip && (
                    <div
                        style={{
                            position: 'fixed',
                            left: `${mousePos.x - 200}px`,
                            top: `${mousePos.y - 340}px`,
                            background: '#000',
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            pointerEvents: 'none',
                            zIndex: 1000,
                            fontFamily: 'ModernEra, Arial, sans-serif',
                            opacity: 1,
                            transition: 'opacity 0.2s ease-in-out',
                            animation: 'fadeIn 0.2s ease-in-out',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>{tooltip.text}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>
                            {tooltip.value}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center mb-4">
                <label className="flex items-center gap-3 text-sm text-[var(--stone)] cursor-pointer">
                    <span>Hide common words</span>
                    <div className="relative inline-block w-11 h-6">
                        <input
                            type="checkbox"
                            checked={filterCommon}
                            onChange={(e) => setFilterCommon(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--blue)]"></div>
                    </div>
                </label>
            </div>
        </div>
    )
}

export default WordCloudViz

