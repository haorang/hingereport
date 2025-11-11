import { useState } from 'react'
import Upload from './Upload'

// Helper function to track events with Google Analytics
const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

function Share({ stats, handleFileUpload, dataProcessed, dateRange}) {
    const [copied, setCopied] = useState(false)

    const generateSummary = () => {
        if (!stats) return ''
        
        const matchRate = stats.like > 0 ? ((stats.match_from_like / stats.like) * 100).toFixed(1) : '0'
        const avgMessages = stats.num_msgs && stats.num_msgs.length > 0
            ? (stats.num_msgs.reduce((a, b) => a + b, 0) / stats.num_msgs.length).toFixed(1)
            : '0'
        const maxMessages = stats.num_msgs && stats.num_msgs.length > 0
            ? Math.max(...stats.num_msgs)
            : '0'
        const incomingMatchRate = stats.incoming_like_match / (stats.incoming_like_x + stats.incoming_like_match) * 100
        return `My Hinge Stats (${(new Date(dateRange.start)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} - ${(new Date(dateRange.end)).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}:
• ${stats.like} likes sent (${matchRate}% match rate from likes sent)
• ${stats.incoming_like_match + stats.incoming_like_x} likes received (${incomingMatchRate.toFixed(1)}% match rate from likes received)
• ${stats.match} matches
• ${avgMessages} messages per chat
• ${maxMessages} messages in longest chat

Generated with Hinge Stats: ${window.location.origin}`
    }

    const handleCopy = async () => {
        const summary = generateSummary()
        
        // Track share/copy click
        trackEvent('share_copy_clicked');
        
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
    
    const handleGitHubClick = () => {
        trackEvent('github_link_clicked');
    }
    
    const handleEmailClick = () => {
        trackEvent('email_link_clicked');
    }
    
    const handleTwitterClick = () => {
        trackEvent('twitter_link_clicked');
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
                <div className="text-[var(--stone)]">
                    View the code on {' '}
                    <a 
                        href="https://github.com/haorang/hingereport" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--blue)] hover:text-[var(--cyan)] underline"
                        onClick={handleGitHubClick}
                    >
                        GitHub
                    </a>
                </div>
                {/* <div className="text-[var(--stone)]">
                    Feel free to send feedback to{' '}
                    <a 
                        href="mailto:ztop2525@gmail.com" 
                        className="text-[var(--blue)] hover:text-[var(--cyan)] underline"
                        onClick={handleEmailClick}
                    >
                        email
                    </a>
                    {' '}or{' '}
                    <a 
                        href="https://x.com/Haorangggg" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--blue)] hover:text-[var(--cyan)] underline"
                        onClick={handleTwitterClick}
                    >
                        twitter
                    </a>
                </div> */}
            </div>
        </div>
    )
}

export default Share

