import BarChart from './BarChart'

function LikesData({ stats, timeZone, setTimeZone }) {
    const timezones = [
        { value: 'Pacific/Honolulu', label: 'Hawaii (HST)' },
        { value: 'America/Anchorage', label: 'Alaska (AKT)' },
        { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
        { value: 'America/Denver', label: 'Mountain (MT)' },
        { value: 'America/Chicago', label: 'Central (CT)' },
        { value: 'America/New_York', label: 'Eastern (ET)' },
        { value: 'UTC', label: 'UTC' },
        { value: 'Europe/London', label: 'London (GMT)' },
        { value: 'Europe/Paris', label: 'Paris (CET)' },
        { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
        { value: 'Australia/Sydney', label: 'Sydney (AEDT)' },
    ]

    return (
        <div className="w-full border-2 border-[var(--hblack)] rounded-lg">
            <div className="p-4 border-[var(--hblack)]">
                <label className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--hblack)]">Timezone:</span>
                    <select 
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        className="px-3 py-1 border border-[var(--hblack)] rounded bg-white text-[var(--hblack)] text-sm"
                    >
                        {timezones.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                                {tz.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <BarChart stats={stats} timeZone={timeZone} />  
        </div>
    )
}

export default LikesData  