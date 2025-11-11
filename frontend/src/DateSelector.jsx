import { useState, useEffect } from 'react'

function DateSelector({ earliestDate, latestDate, dateRange, setDateRange }) {
    if (!earliestDate || !latestDate) {
        return null
    }

    const earliest = new Date(earliestDate)
    const latest = new Date(latestDate)
    
    // Initialize range to full span if not set
    const [startDate, setStartDate] = useState(dateRange?.start || earliestDate)
    const [endDate, setEndDate] = useState(dateRange?.end || latestDate)

    // Update parent when dates change
    useEffect(() => {
        setDateRange({ start: startDate, end: endDate })
    }, [startDate, endDate, setDateRange])

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    // Format date for input[type="date"]
    const formatDateInput = (dateStr) => {
        const date = new Date(dateStr)
        return date.toISOString().split('T')[0]
    }

    return (
        <div className="max-w-2xl mx-auto my-6 p-4 border-2 border-[var(--hblack)] rounded-lg bg-white">
            <div className="mb-3">
                <h3 className="text-lg font-semibold text-[var(--hblack)] mb-2">Filter by Date Range</h3>
                <p className="text-sm text-[var(--stone)]">
                    Data available from {formatDate(earliestDate)} to {formatDate(latestDate)}
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-[var(--hblack)] mb-1">
                        Start Date
                    </label>
                    <input
                        type="date"
                        value={formatDateInput(startDate)}
                        min={formatDateInput(earliestDate)}
                        max={formatDateInput(endDate)}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--hblack)] rounded text-[var(--hblack)] text-sm"
                    />
                </div>
                
                <div className="pt-6 text-[var(--stone)]">→</div>
                
                <div className="flex-1">
                    <label className="block text-sm font-medium text-[var(--hblack)] mb-1">
                        End Date
                    </label>
                    <input
                        type="date"
                        value={formatDateInput(endDate)}
                        min={formatDateInput(startDate)}
                        max={formatDateInput(latestDate)}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--hblack)] rounded text-[var(--hblack)] text-sm"
                    />
                </div>
                
                <button
                    onClick={() => {
                        setStartDate(earliestDate)
                        setEndDate(latestDate)
                    }}
                    className="mt-6 px-4 py-2 bg-[var(--hblack)] text-white rounded text-sm font-medium hover:opacity-80 transition-opacity"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}

export default DateSelector

