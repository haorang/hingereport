import { ResponsiveBoxPlot } from '@nivo/boxplot'

function BoxPlot({ data }) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return <div className="p-4">No message data available</div>
    }

    // Transform data into Nivo format
    const nivoData = data.map((value, index) => ({
        group: 'Messages',
        subgroup: 'All',
        value: value
    }))

    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold text-[var(--hblack)] mb-2">Messages Per Conversation</h3>
            
            <div style={{ height: '400px', width: '100%' }}>
                <ResponsiveBoxPlot
                    data={nivoData}
                    margin={{ top: 60, right: 140, bottom: 60, left: 60 }}
                    minValue={0}
                    maxValue="auto"
                    subGroupBy="subgroup"
                    padding={0.12}
                    enableGridX={true}
                    axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendOffset: 36
                    }}
                    axisRight={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendOffset: 0
                    }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'distribution',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Number of Messages',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    colors={{ scheme: 'nivo' }}
                    borderRadius={2}
                    borderWidth={2}
                    borderColor={{
                        from: 'color',
                        modifiers: [['darker', 0.3]]
                    }}
                    medianWidth={2}
                    medianColor={{
                        from: 'color',
                        modifiers: [['darker', 0.3]]
                    }}
                    whiskerEndSize={0.6}
                    whiskerColor={{
                        from: 'color',
                        modifiers: [['darker', 0.3]]
                    }}
                    motionConfig="stiff"
                    legends={[
                        {
                            anchor: 'right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemWidth: 60,
                            itemHeight: 20,
                            itemsSpacing: 3,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            symbolSize: 20,
                            symbolShape: 'square',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    )
}

export default BoxPlot

