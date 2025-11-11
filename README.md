###

- Basic matches, results counts 
- Matches by Like time sent 
- Matches by match time 
- Likes succcess rate with or without message 
- Stats over time (cut up total time period into 10 slices)
- chat word map 
- share to others 

Json format:
- you can only see if you remove
List of interactions, one per person which can have:
    - 'match': you matched with someone  
        - 'timestamp': time of match
    - 'like': you sent a like
        - 'timestamp': time of like sent 
        - 'like':
            -'timestamp': same as time above
            -'comment': message you sent with like
    - 'chats': messages you sent 
            - 'body': the message
            - 'timestamp': time of sent message
    - 'block': you unmatch or X out an incoming like
        - 'block_type': usually is remove
        - 'timestamp': timestamp of removal of match or incoming like
    - 'voice_notes'
        - 'url': url to recording can only see if authenticated 
        - 'timestamp': timestamp of sent note



    



