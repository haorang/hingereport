
##hingereport.com
Frontend only app to process and visualize Hinge personal data

```
cd frontend
npm run dev
```

matches.json format:
List of interactions, one per person which can have:
    - 'match': you matched with someone  
        - 'timestamp': time of match
    - 'like': you sent a like
        - 'timestamp': time of like sent 
        - 'like':
            - 'timestamp': same as time above
            - 'comment': message you sent with like
    - 'chats': messages you sent 
            - 'body': the message
            - 'timestamp': time of sent message
    - 'block': you unmatch or X out an incoming like
        - 'block_type': usually is remove
        - 'timestamp': timestamp of removal of match or incoming like
    - 'voice_notes'
        - 'url': url to recording can only see if authenticated 
        - 'timestamp': timestamp of sent note



    



