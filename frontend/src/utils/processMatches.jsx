export function processMatches(matchesData) {
    if (!matchesData || !Array.isArray(matchesData) || matchesData.length === 0) {
        return {
            we_met: 0,
            match: 0,
            chats: 0,
            like: 0,
            block: 0,
            incoming_like_x: 0,
            incoming_like_match: 0,
            match_from_like: 0,
            match_from_like_with_msg: 0,
            match_from_like_no_msg: 0,
            like_sent_with_msg: 0,
            like_sent_no_msg: 0,
            like_with_no_resp: 0,
            you_unmatched: 0,
            matched_no_chat: 0,
            matched_5plus_messages: 0,
            matched_1_4_messages: 0,
            num_msgs: [],
            num_words: [],
            word_frequency: {},
            key_set: new Set(),
            earliest_date: null,
            latest_date: null,
        }
    }

    let we_met = 0
    let match = 0
    let chats = 0
    let like = 0
    let block = 0
    let incoming_like_x = 0
    let incoming_like_match = 0
    let match_from_like = 0
    let match_from_like_with_msg = 0
    let match_from_like_no_msg = 0
    let like_sent_with_msg = 0
    let like_sent_no_msg = 0
    let like_with_no_resp = 0
    let you_unmatched = 0
    let num_msgs = []
    let num_words = []
    let key_set = new Set()
    let matched_no_chat = 0
    let matched_1_4_messages = 0
    let matched_5plus_messages = 0
    let likes_by_hr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let matches_by_like_hr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let earliest_date = null
    let latest_date = null
    let word_frequency = {}
    for (const row of matchesData) {
        // Track unique key sets
        const keys = Object.keys(row)
        key_set.add(JSON.stringify(keys.sort()))

        if ('we_met' in row) {
            we_met += 1
        }
        if ('match' in row) {
            match += 1
            if (earliest_date === null || new Date(row.match[0].timestamp) < earliest_date) {
                earliest_date = new Date(row.match[0].timestamp)
            }
            if (latest_date === null || new Date(row.match[0].timestamp) > latest_date) {
                latest_date = new Date(row.match[0].timestamp)
            }
        }
        if ('chats' in row) {
            chats += 1
        }
        if ('like' in row) {
            like += 1
            if (earliest_date === null || new Date(row.like[0].timestamp) < earliest_date) {
                earliest_date = new Date(row.like[0].timestamp)
            }
            if (latest_date === null || new Date(row.like[0].timestamp) > latest_date) {
                latest_date = new Date(row.like[0].timestamp)
            }
            // Check if like has a comment/message
            // Structure: row['like'][0]['like'][0] may have 'comment'
            const hasComment = row.like && 
                              Array.isArray(row.like) && 
                              row.like.length > 0 &&
                              row.like[0] &&
                              row.like[0].like &&
                              Array.isArray(row.like[0].like) &&
                              row.like[0].like.length > 0 &&
                              row.like[0].like[0] &&
                              'comment' in row.like[0].like[0]

            if (hasComment) {
                like_sent_with_msg += 1
                if ('match' in row) {
                    match_from_like_with_msg += 1
                }
            } else {
                like_sent_no_msg += 1
                if ('match' in row) {
                    match_from_like_no_msg += 1
                }
            }
            const like_hr = new Date(row.like[0].timestamp).getHours()
            likes_by_hr[like_hr] += 1
        }
        if ('block' in row) {
            block += 1
        }
        if ('like' in row && 'match' in row) {
            match_from_like += 1
            const like_hr = new Date(row.like[0].timestamp).getHours()
            matches_by_like_hr[like_hr] += 1
        }
        if ('match' in row && 'block' in row) {
            you_unmatched += 1
        }
        if (!('match' in row) && 'block' in row) {
            incoming_like_x += 1
        }
        if ('match' in row && !('like' in row)) {
            incoming_like_match += 1
        }
        if ('match' in row) {
            if (!('chats' in row)) {
                // num_msgs.push(0)
            } else {
                num_msgs.push(row.chats.length)
                for (const chat of row.chats) {
                    if (chat.body && typeof chat.body === 'string') {
                        const words = chat.body.split(' ')
                        num_words.push(words.length)
                        
                        // Process words for word cloud
                        // Common stop words to exclude
                        const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                                                     'of', 'with', 'as', 'by', 'from', 'up', 'about', 'into', 'through',
                                                     'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his',
                                                     'her', 'its', 'our', 'their', 'me', 'him', 'us', 'them', 'is',
                                                     'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
                                                     'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could',
                                                     'may', 'might', 'must', 'can', 'that', 'this', 'these', 'those',
                                                     'what', 'which', 'who', 'when', 'where', 'why', 'how', 'if', 'so', 
                                                     'then', 'all', 'u', 'ur'])
                        
                        words.forEach(originalWord => {
                            // Extract emojis first (they might be separate or combined with text)
                            const emojiRegex = /\p{Emoji}/gu
                            const emojis = originalWord.match(emojiRegex) || []
                            
                            // Count emojis separately (but exclude emoji keycaps like 1️⃣, 2️⃣, etc.)
                            emojis.forEach(emoji => {
                                // Skip emoji keycaps (number emojis) - they contain variation selectors
                                if (emoji.includes('\uFE0F') || emoji.includes('\u20E3')) {
                                    return
                                }
                                // Also skip if it's just a digit character
                                if (/^\d$/.test(emoji)) {
                                    return
                                }
                                word_frequency[emoji] = (word_frequency[emoji] || 0) + 1
                            })
                            
                            // Clean word: keep only Unicode letters and numbers
                            let word = originalWord.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
                            
                            // Skip if empty after cleaning
                            if (word.length === 0) return
                            
                            // Word must contain at least one letter (excludes pure numbers like "5" or "123")
                            const hasLetter = /\p{L}/u.test(word)
                            
                            // Only count words that have at least one letter and are not stop words
                            if (hasLetter && !stopWords.has(word)) {
                                word_frequency[word] = (word_frequency[word] || 0) + 1
                            }
                        })
                    }
                }
                //
            }
        }
        if ('like' in row && !('match' in row)) {
            like_with_no_resp += 1
        }
        // Track chat status for matched items
        if ('match' in row) {
            const hasChats = 'chats' in row && Array.isArray(row.chats) && row.chats.length > 0
            if (!hasChats) {
                matched_no_chat += 1
            } else if (row.chats.length >= 1 && row.chats.length <= 4) {
                matched_1_4_messages += 1
            } else {
                matched_5plus_messages += 1
            }
        }
    }
    return {
        total_interactions: matchesData.length,
        we_met,
        match,
        chats,
        like,
        block,
        incoming_like_x,
        incoming_like_match,
        match_from_like,
        match_from_like_with_msg,
        match_from_like_no_msg,
        like_sent_with_msg,
        like_sent_no_msg,
        like_with_no_resp,
        you_unmatched,
        matched_no_chat,
        matched_1_4_messages,
        matched_5plus_messages,
        num_msgs,
        num_words,
        word_frequency,
        key_set: Array.from(key_set), // Convert Set to Array for JSON serialization,
        likes_by_hr,
        matches_by_like_hr,
        earliest_date,
        latest_date,
    }
}

export function filterMatchesByDate(matchesData, startDate, endDate) {
    if (!matchesData || !Array.isArray(matchesData)) {
        return []
    }

    if (!startDate || !endDate) {
        return matchesData
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    // Set end date to end of day
    end.setHours(23, 59, 59, 999)

    return matchesData.filter(row => {
        let timestamp = null

        // Priority 1: Check 'like' timestamp
        if ('like' in row && Array.isArray(row.like) && row.like.length > 0 && row.like[0].timestamp) {
            timestamp = row.like[0].timestamp
        }
        // Priority 2: Check 'match' timestamp
        else if ('match' in row && Array.isArray(row.match) && row.match.length > 0 && row.match[0].timestamp) {
            timestamp = row.match[0].timestamp
        }
        // Priority 3: Check 'block' timestamp
        else if ('block' in row && Array.isArray(row.block) && row.block.length > 0 && row.block[0].timestamp) {
            timestamp = row.block[0].timestamp
        }

        // If no timestamp found, exclude the row
        if (!timestamp) {
            console.log(row)
            return false
        }

        const rowDate = new Date(timestamp)
        return rowDate >= start && rowDate <= end
    })
}
