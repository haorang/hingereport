import { useState, useEffect } from 'react'

function SliderDateSelector({ earliestDate, latestDate, dateRange, setDateRange }) {
    if (!earliestDate || !latestDate) {
        return null
    }

    const earliest = new Date(earliestDate)
    const latest = new Date(latestDate)
    
    // Convert dates to timestamps for slider calculation
    const minTime = earliest.getTime()
    const maxTime = latest.getTime()
    
    // Calculate minimum gap (3 days) as a percentage of total range
    const threeDaysMs = 3 * 24 * 60 * 60 * 1000
    const totalRangeMs = maxTime - minTime
    const minGapPercent = (threeDaysMs / totalRangeMs) * 100
    
    // Initialize slider values (0-100 range)
    const [startValue, setStartValue] = useState(0)
    const [endValue, setEndValue] = useState(100)
    
    // Initialize date range on first render
    useEffect(() => {
        if (earliestDate && latestDate) {
            setDateRange({ 
                start: earliestDate, 
                end: latestDate 
            })
        }
    }, [earliestDate, latestDate, setDateRange])

    // Convert slider value (0-100) to date
    const valueToDate = (value) => {
        const timestamp = minTime + (maxTime - minTime) * (value / 100)
        return new Date(timestamp).toISOString().split('T')[0]
    }

    // Convert date to slider value (0-100)
    const dateToValue = (dateStr) => {
        const date = new Date(dateStr)
        const timestamp = date.getTime()
        return ((timestamp - minTime) / (maxTime - minTime)) * 100
    }

    // Update parent state with current slider values
    const updateDateRange = () => {
        const start = valueToDate(startValue)
        const end = valueToDate(endValue)
        setDateRange({ start, end })
    }

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    const handleReset = () => {
        setStartValue(0)
        setEndValue(100)
        // Update immediately on reset
        setTimeout(() => {
            setDateRange({ 
                start: valueToDate(0), 
                end: valueToDate(100) 
            })
        }, 0)
    }

    const handleStartChange = (e) => {
        const value = parseFloat(e.target.value)
        // Ensure at least 3 days gap from end value
        const maxAllowedStart = endValue - minGapPercent
        setStartValue(Math.min(value, maxAllowedStart))
    }

    const handleEndChange = (e) => {
        const value = parseFloat(e.target.value)
        // Ensure at least 3 days gap from start value
        const minAllowedEnd = startValue + minGapPercent
        setEndValue(Math.max(value, minAllowedEnd))
    }

    // Only update parent when user releases the slider
    const handleSliderRelease = () => {
        updateDateRange()
    }

    return (
        <div className="w-full p-4 border-2 border-[var(--hblack)] rounded-lg bg-white">
            <div className="mb-4">
                <h3 className="text-base font-regular text-[var(--hblack)] mb-2">Using data from</h3>
                <p className="text-sm text-[var(--stone)]">
                    {formatDate(valueToDate(startValue))} — {formatDate(valueToDate(endValue))}
                </p>
            </div>
            
            <div className="relative mb-3 py-3">
                {/* Track background */}
                <div className="absolute w-full h-2 bg-gray-200 rounded top-1/2 -translate-y-1/2"></div>
                
                {/* Selected range */}
                <div 
                    className="absolute h-2 bg-[var(--blue)] rounded top-1/2 -translate-y-1/2"
                    style={{
                        left: `${startValue}%`,
                        width: `${endValue - startValue}%`
                    }}
                ></div>
                
                {/* Start slider */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={startValue}
                    onChange={handleStartChange}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--hblack)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--hblack)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                    style={{ zIndex: startValue > 50 ? 5 : 4 }}
                />
                
                {/* End slider */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={endValue}
                    onChange={handleEndChange}
                    onMouseUp={handleSliderRelease}
                    onTouchEnd={handleSliderRelease}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--hblack)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--hblack)] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                    style={{ zIndex: endValue <= 50 ? 5 : 4 }}
                />
            </div>
            
            <div className="flex justify-center items-center text-xs text-[var(--stone)]">
                <button
                    onClick={handleReset}
                    className="group px-4 py-2 text-[var(--hblack)] bg-[var(--hwhite)] border border-[var(--hblack)] rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:text-[var(--hwhite)] hover:bg-[var(--hblack)]"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}

export default SliderDateSelector

