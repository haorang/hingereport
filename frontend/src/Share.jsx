import { useState } from 'react'
import Upload from './Upload'

function Share({ stats, handleFileUpload, dataProcessed }) {
    const [copied, setCopied] = useState(false)

    const generateSummary = () => {
        if (!stats) return ''
        
        const matchRate = stats.like > 0 ? ((stats.match_from_like / stats.like) * 100).toFixed(1) : '0'
        const avgMessages = stats.num_msgs && stats.num_msgs.length > 0
            ? (stats.num_msgs.reduce((a, b) => a + b, 0) / stats.num_msgs.length).toFixed(1)
            : '0'
        
        return `My Hinge Stats:
• ${stats.total_interactions} total interactions
• ${stats.match} matches (${matchRate}% match rate from likes sent)
• ${stats.incoming_like_match + stats.incoming_like_x} likes received
• Average ${avgMessages} messages per chat

Generated with Hinge Stats: ${window.location.origin}`
    }

    const handleCopy = async () => {
        const summary = generateSummary()
        
        try {
            await navigator.clipboard.writeText(summary)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = summary
            textArea.style.position = 'fixed'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.select()
            try {
                document.execCommand('copy')
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            } catch (e) {
                alert('Failed to copy. Please copy manually.')
            }
            document.body.removeChild(textArea)
        }
    }

    if (!stats) {
        return null
    }

    return (
        <div className="w-full p-4 rounded-lg bg-[var(--hblack)] border-2 border-[var(--hwhite)]">
            <div className="mb-6">
                <Upload handleFileUpload={handleFileUpload} dataProcessed={dataProcessed} />
            </div>
            
            <div 
                onClick={handleCopy}
                className="mb-6 w-fit mx-auto px-4 py-2 rounded-lg bg-[var(--hblack)] border border-[var(--hwhite)] cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
            >
                <span className="text-sm text-[var(--hwhite)]">
                    {copied ? '✓ Copied to clipboard!' : 'Click to copy a shareable summary'}
                </span>
                <svg 
                    className={`w-5 h-5 ${copied ? 'text-[var(--green)]' : 'text-[var(--hwhite)]'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    {copied ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                </svg>
            </div>

            <div className="space-y-2 text-sm">
                <div>
                    <a 
                        href="https://github.com/yourusername/hingedata" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--blue)] hover:text-[var(--cyan)] underline"
                    >
                        View the source code on GitHub
                    </a>
                </div>
                <div className="text-[var(--stone)]">
                    Feel free to send feedback to{' '}
                    <a 
                        href="mailto:your-email@example.com" 
                        className="text-[var(--blue)] hover:text-[var(--cyan)] underline"
                    >
                        email
                    </a>
                    {' '}or{' '}
                    <a 
                        href="https://twitter.com/yourusername" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--blue)] hover:text-[var(--cyan)] underline"
                    >
                        Twitter
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Share

