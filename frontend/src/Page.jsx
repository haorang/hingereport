import { useState, useMemo } from 'react'
import Upload from './Upload'
import { processMatches, filterMatchesByDate } from './utils/processMatches'
import MatchesData from './MatchesData'
import MatchesBlurb from './MatchesBlurb'
import LikesBlurb from './LikesBlurb'
import LikesData from './LikesData'
import SliderDateSelector from './SliderDateSelector'
import MessagesData from './MessagesData'
import MessagesBlurb from './MessagesBlurb'
import Share from './Share'

// Helper component for staggered animations
const AnimatedModule = ({ children, delay = 0 }) => (
  <div 
    className="module-enter"
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </div>
)

// Helper function to track events with Google Analytics
const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

function Page() {
    const [matches, setMatches] = useState([])
    const [dateRange, setDateRange] = useState(null)  // User's date filter
    const [timeZone, setTimeZone] = useState('America/Los_Angeles')
    const [earliestDate, setEarliestDate] = useState(null)  // Set once on upload
    const [latestDate, setLatestDate] = useState(null)  // Set once on upload
    const [dataProcessed, setDataProcessed] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isFadingOut, setIsFadingOut] = useState(false)

    // Filter matches by date range
    const filteredMatches = useMemo(() => {
      if (!dateRange || !dateRange.start || !dateRange.end) return matches
      return filterMatchesByDate(matches, dateRange.start, dateRange.end)
    }, [matches, dateRange])
    
    // Calculate stats from filtered matches - ONLY recalculates when filteredMatches changes
    const stats = useMemo(() => {
      if (!filteredMatches.length) return null
      return processMatches(filteredMatches)
    }, [filteredMatches])

    // Helper function to process loaded JSON data
    const processLoadedData = (jsonData) => {
        setMatches(jsonData)
        
        // Calculate earliest and latest dates from full dataset (only once)
        const fullStats = processMatches(jsonData)
        setEarliestDate(fullStats.earliest_date)
        setLatestDate(fullStats.latest_date)
        
        setDataProcessed(true)
        setIsProcessing(false)
        setIsFadingOut(false)
        
        // Track successful data processing
        trackEvent('data_processed');
        
    }

    // Process the matches and calculate stats
    const handleFileUpload = (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Track file upload attempt
        trackEvent('file_upload_attempt');

        // Start fade-out animation
        setIsFadingOut(true)
        
        // After fade-out completes, start processing
        setTimeout(() => {
            setIsProcessing(true)
            setDataProcessed(false)

            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result)
                    // Simulate processing time for better UX
                    setTimeout(() => {
                        processLoadedData(jsonData)
                    }, 300)
                } catch (error) {
                    console.error('Error parsing JSON:', error)
                    // Track error
                    trackEvent('file_upload_error');
                    setIsProcessing(false)
                    setIsFadingOut(false)
                }
            }
            reader.readAsText(file)
        }, 400) // Wait for fade-out animation
    }

    // Load sample data
    const loadSampleData = async () => {
        // Track sample data load attempt
        trackEvent('sample_data_clicked');
        
        // Start fade-out animation
        setIsFadingOut(true)
        
        // After fade-out completes, start processing
        setTimeout(async () => {
            setIsProcessing(true)
            setDataProcessed(false)
            
            try {
                const response = await fetch('/data/matches.json')
                if (!response.ok) {
                    throw new Error('Failed to load sample data')
                }
                const jsonData = await response.json()
                // Simulate processing time for better UX
                setTimeout(() => {
                    processLoadedData(jsonData)
                }, 300)
            } catch (error) {
                console.error('Error loading sample data:', error)
                // Track error
                trackEvent('sample_data_error');
                alert('Failed to load sample data. Please try uploading your own file.')
                setIsProcessing(false)
                setIsFadingOut(false)
            }
        }, 400) // Wait for fade-out animation
    }

    return (
      <div className="flex flex-col">
        <div className="font-[TiemposHeadline] text-4xl text-center mb-8">
            The Hinge Report
        </div>
        {!dataProcessed && !isProcessing && (
        <div className={`px-4 max-w-7xl mx-auto mb-8 ${isFadingOut ? 'module-exit' : ''}`}>
          <div className="border-2 border-[var(--hblack)] rounded-lg p-4 text-center max-w-lg mx-auto">
              This website generates stats and a few charts from your Hinge data obtained from the 'Download My Data' feature in Hinge. No data is saved and everything is processed in your browser.
              <br /><br />
              To get started, upload your matches.json file below. If you need to get the data, follow the <a href="https://help.hinge.co/hc/en-us/articles/360011235813-How-do-I-request-a-copy-of-my-personal-data" target="_blank" className="text-[var(--blue)] underline hover:text-[var(--cyan)] cursor-pointer">instructions here</a> and unzip the downloaded file to obtain matches.json.
              <br /><br />
              If you want to try it out with some sample data,{' '}
              <button 
                  onClick={loadSampleData}
                  className="text-[var(--blue)] underline hover:text-[var(--cyan)] cursor-pointer"
              >
                  click here
              </button>
              {' '}to use my data (no laughing and pointing). 
          </div>
        </div>
        )}
        {!dataProcessed && !isProcessing && (
        <div className={`px-4 max-w-7xl mx-auto ${isFadingOut ? 'module-exit' : ''}`}>
          <Upload handleFileUpload={handleFileUpload} dataProcessed={dataProcessed} />
        </div>
        )}
        {isProcessing && (
        <div className="px-4 max-w-7xl mx-auto text-center py-12 module-enter" style={{ animationDelay: '0s' }}>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--hblack)]"></div>
          <p className="mt-4 text-[var(--stone)]">Processing your data...</p>
        </div>
        )}
        {dataProcessed && (
        <>
          {/* Desktop: Date selector at top, outside columns */}
          <div className="hidden md:block px-4 max-w-7xl mx-auto mb-6 min-w-lg">
            <div className="max-w-2xl mx-auto">
              <AnimatedModule delay={0.05}>
                <SliderDateSelector 
                  earliestDate={earliestDate} 
                  latestDate={latestDate}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                />
              </AnimatedModule>
            </div>
          </div>
          
          {/* Mobile: Single column with desired order */}
          <div className="flex flex-col md:hidden gap-6 px-4 max-w-7xl mx-auto">
            <AnimatedModule delay={0.1}>
              <SliderDateSelector 
                earliestDate={earliestDate} 
                latestDate={latestDate}
                dateRange={dateRange}
                setDateRange={setDateRange}
              />
            </AnimatedModule>
            <AnimatedModule delay={0.2}>
              <MatchesBlurb stats={stats} dateRange={dateRange} />
            </AnimatedModule>
            <AnimatedModule delay={0.3}>
              <MatchesData stats={stats} />
            </AnimatedModule>
            <AnimatedModule delay={0.4}>
              <LikesBlurb stats={stats} timeZone={timeZone} />
            </AnimatedModule>
            <AnimatedModule delay={0.5}>
              <LikesData stats={stats} timeZone={timeZone} setTimeZone={setTimeZone} />
            </AnimatedModule>
            <AnimatedModule delay={0.6}>
              <MessagesBlurb stats={stats} />
            </AnimatedModule>
            <AnimatedModule delay={0.7}>
              <MessagesData stats={stats} />
            </AnimatedModule>
            <AnimatedModule delay={0.8}>
              <Share stats={stats} handleFileUpload={handleFileUpload} dataProcessed={dataProcessed} dateRange={dateRange} />
            </AnimatedModule>
          </div>
          
          {/* Desktop: Two column masonry layout */}
          <div className="hidden md:block md:columns-2 md:column-gap-6 px-4 max-w-5xl mx-auto">
            <div className="break-inside-avoid mb-6">
              <AnimatedModule delay={0.1}>
                <MatchesData stats={stats} />
              </AnimatedModule>
            </div>
            <div className="break-inside-avoid mb-6">
              <AnimatedModule delay={0.2}>
                <LikesBlurb stats={stats} timeZone={timeZone} />
              </AnimatedModule>
            </div>
            <div className="break-inside-avoid mb-6">
              <AnimatedModule delay={0.3}>
                <MessagesData stats={stats} />
              </AnimatedModule>
            </div>
            <div className="break-inside-avoid mb-6">
              <AnimatedModule delay={0.4}>
                <MatchesBlurb stats={stats} dateRange={dateRange} />
              </AnimatedModule>
            </div>
            <div className="break-inside-avoid mb-6">
              <AnimatedModule delay={0.5}>
                <LikesData stats={stats} timeZone={timeZone} setTimeZone={setTimeZone} />
              </AnimatedModule>
            </div>
            <div className="break-inside-avoid mb-6">
              <AnimatedModule delay={0.6}>
                <MessagesBlurb stats={stats} />
              </AnimatedModule>
            </div>
            <div className="break-inside-avoid mb-6">
              <AnimatedModule delay={0.7}>
                <Share stats={stats} handleFileUpload={handleFileUpload} dataProcessed={dataProcessed} dateRange={dateRange} />
              </AnimatedModule>
            </div>
          </div>
        </>
        )}
        {!isProcessing && (
          <footer className="mt-auto py-8 px-4 text-center">
            <p className="text-sm text-gray-500">
              This website is not affiliated with, endorsed by, or associated with Hinge or Match Group, Inc.
            </p>

            <p className="text-sm text-gray-500">Feel free to send any issues/feedback to <a href="mailto:ztop2525@gmail.com" className="text-[var(--blue)] hover:text-[var(--cyan)] underline">email</a> or <a href="https://x.com/Haorangggg" target="_blank" rel="noopener noreferrer" className="text-[var(--blue)] hover:text-[var(--cyan)] underline">twitter</a>.</p>
          </footer>
        )}
      </div>
    )
  }
  
  export default Page
  