import { ResponsiveSankey } from '@nivo/sankey'

// Helper function to convert stats to Nivo Sankey diagram format
function statsToSankeyData(stats) {
    // Column 1: Like sent, Like received
    const likeSent = stats.like
    const likeReceived = stats.incoming_like_match + stats.incoming_like_x
    
    // Column 2: Matched, Like ignored, X received like
    const matchedFromSent = stats.match_from_like
    const matchedFromReceived = stats.incoming_like_match
    const likeIgnored = stats.like_with_no_resp
    const xReceivedLike = stats.incoming_like_x
    
    // Column 3: No chat, 3+ messages (for matched items)
    const matchedNoChat = stats.matched_no_chat
    const matched14Messages = stats.matched_1_4_messages
    const matched5PlusMessages = stats.matched_5plus_messages
    
    // Build nodes with string IDs (required by Nivo)
    // Order matters: nodes are positioned based on their position in the flow

    const receivedId = 'Like received'
    const sentId = 'Like sent'
    const matchedId = 'Matched'
    const xReceivedLikeId = 'X received like'
    const likeIgnoredId = 'Like ignored'
    const noChatId = 'No chat'
    const one4MessagesId = '1-4 messages'
    const fivePlusMessagesId = '5+ messages'

    const nodes = [
        // Column 1: Starting nodes
        { id: receivedId, nodeColor: 'var(--cyan)' },
        { id: sentId, nodeColor: 'var(--blue)' },
        // Column 2: Intermediate nodes (some terminal, some continue)
        { id: matchedId, nodeColor: 'var(--lime)' },
        { id: xReceivedLikeId, nodeColor: 'var(--orange)' },  // Terminal node
        { id: likeIgnoredId, nodeColor: 'var(--red)' },  // Terminal node
        // Column 3: Terminal nodes (only from Matched)
        { id: noChatId, nodeColor: 'var(--yellow)' },
        { id: one4MessagesId, nodeColor: 'var(--green-yellow)' },
        { id: fivePlusMessagesId, nodeColor: 'var(--green)' },
    ]
    
    // Build links with string source/target IDs (required by Nivo)
    const links = []

    if (matchedFromSent > 0) {
        links.push({ source: sentId, target: matchedId, value: matchedFromSent })
    }
    
    // Column 1 → Column 2: From Like received
    
    if (matchedNoChat > 0) {
        links.push({ source: matchedId, target: noChatId, value: matchedNoChat })
    }
    if (matched14Messages > 0) {
        links.push({ source: matchedId, target: one4MessagesId, value: matched14Messages })
    }
    if (matched5PlusMessages > 0) {
        links.push({ source: matchedId, target: fivePlusMessagesId, value: matched5PlusMessages })
    }
    
    if (matchedFromReceived > 0) {
        links.push({ source: receivedId, target: matchedId, value: matchedFromReceived })
    }

    
    // Column 1 → Column 2: From Like sent
    if (likeIgnored > 0) {
        links.push({ source: sentId, target: likeIgnoredId, value: likeIgnored })
    }
    if (xReceivedLike > 0) {
        links.push({ source: receivedId, target: xReceivedLikeId, value: xReceivedLike })
    }
    // if (matchedFromSent > 0) {
    //     links.push({ source: 'Like sent', target: 'Matched', value: matchedFromSent })
    // }
    
    // // Column 1 → Column 2: From Like received
    // if (matchedFromReceived > 0) {
    //     links.push({ source: 'Like received', target: 'Matched', value: matchedFromReceived })
    // }
    
    // Column 2 → Column 3: Only from Matched (Like ignored and X received like are terminal)
    // if (matchedNoChat > 0) {
    //     links.push({ source: 'Matched', target: 'No chat', value: matchedNoChat })
    // }
    // if (matched3PlusMessages > 0) {
    //     links.push({ source: 'Matched', target: '3+ messages', value: matched3PlusMessages })
    // }
    
    // Note: "Like ignored" and "X received like" have no outgoing links,
    // so they will be positioned as terminal nodes in column 2
    
    return { nodes, links }
}

// Create custom label component factory that has access to stats
function createSankeyLabelComponent(stats) {
    // Map node ID patterns to display names and values
    const nodeValueMap = {
        'Like received': stats.incoming_like_match + stats.incoming_like_x,
        'Like sent': stats.like,
        'Matched': stats.match_from_like + stats.incoming_like_match,
        'X received like': stats.incoming_like_x,
        'Like ignored': stats.like_with_no_resp,
        'No chat': stats.matched_no_chat,
        '1-4 messages': stats.matched_1_4_messages,
        '5+ messages': stats.matched_5plus_messages,
    }
    
    return (props) => {
        const { node } = props
        const id = node.id || ''
        
        // Extract base name from ID (remove trailing numbers)
        const baseName = id.replace(/\d+$/, '').trim()
        const value = nodeValueMap[baseName] || 0
        
        // Calculate center position
        const x = node.x0 + (node.x1 - node.x0) / 2
        const y = node.y0 + (node.y1 - node.y0) / 2
        
        return (
            <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                    fill: '#333',
                    fontSize: '11px',
                    fontWeight: 500,
                    pointerEvents: 'none',
                }}
            >
                <tspan x={x} dy="-7">
                    {baseName}
                </tspan>
                <tspan x={x} dy="14" style={{ fontWeight: 700, fontSize: '13px' }}>
                    {value}
                </tspan>
            </text>
        )
    }
}

// Create custom tooltip component factory that has access to stats
function createSankeyTooltipComponent(stats) {
    // Map node ID patterns to display names and values
    const nodeValueMap = {
        'Like received': stats.incoming_like_match + stats.incoming_like_x,
        'Like sent': stats.like,
        'Matched': stats.match_from_like + stats.incoming_like_match,
        'X received like': stats.incoming_like_x,
        'Like ignored': stats.like_with_no_resp,
        'No chat': stats.matched_no_chat,
        '1-4 messages': stats.matched_1_4_messages,
        '5+ messages': stats.matched_5plus_messages,
    }
    
    return ({ node }) => {
        const id = node.id || ''
        // Extract base name from ID (remove trailing numbers and spaces)
        const baseName = id.replace(/\d+$/, '').trim()
        const value = nodeValueMap[baseName] ?? nodeValueMap[baseName.trim()] ?? 0
        
        return (
            <div style={{
                background: '#000',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'ModernEra, Arial, sans-serif'
            }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    {baseName}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>
                    {value.toLocaleString()}
                </div>
            </div>
        )
    }
}

// Create custom link tooltip component matching node tooltip style
function createSankeyLinkTooltipComponent() {
    return ({ link }) => {
        // Extract node names from source and target IDs
        const sourceName = (link.source?.id || link.source || '').replace(/\d+$/, '').trim()
        const targetName = (link.target?.id || link.target || '').replace(/\d+$/, '').trim()
        const value = link.value || 0
        
        return (
            <div style={{
                background: '#000',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '4px',
                fontSize: '13px',
                fontFamily: 'ModernEra, Arial, sans-serif'
            }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    {sourceName} → {targetName}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700 }}>
                    {value.toLocaleString()}
                </div>
            </div>
        )
    }
}

function SankeyDiagram({ stats }) {
    if (!stats) return <div>No data</div>
    
    const sankeyData = statsToSankeyData(stats)
    const SankeyLabelComponent = createSankeyLabelComponent(stats)
    const SankeyTooltipComponent = createSankeyTooltipComponent(stats)
    const SankeyLinkTooltipComponent = createSankeyLinkTooltipComponent()
    
    return (
            <div className="" style={{ width: '100%', height: '400px' }}>
                <ResponsiveSankey
                    data={sankeyData}
                    margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                    align="center"
                    nodeSort="auto"
                    colors={node => node.nodeColor}
                    sort={'input'}
                    nodeOpacity={0.8}
                    nodeHoverOthersOpacity={0.35}
                    nodeThickness={18}
                    nodeSpacing={24}
                    nodeBorderWidth={0}
                    // nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
                    nodeBorderRadius={3}
                    linkOpacity={0.5}
                    linkHoverOthersOpacity={0.1}
                    linkContract={3}
                    enableLinkGradient={true}
                    labelPosition="inside"
                    labelComponent={SankeyLabelComponent}
                    nodeTooltip={SankeyTooltipComponent}
                    linkTooltip={SankeyLinkTooltipComponent}
                    // labelOrientation="vertical"
                    labelPadding={16}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                    // legends={[
                    //     {
                    //         anchor: 'bottom-right',
                    //         direction: 'column',
                    //         translateX: 130,
                    //         itemWidth: 100,
                    //         itemHeight: 14,
                    //         itemDirection: 'right-to-left',
                    //         itemsSpacing: 2,
                    //         itemTextColor: '#999',
                    //         symbolSize: 14
                    //     }
                    // ]}
                />
            </div>
    )
}

export default SankeyDiagram

