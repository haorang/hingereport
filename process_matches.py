import json

with open('matches.json', 'r') as f:
    matches_data= json.load(f)

we_met = 0
match = 0
chats = 0
like = 0
block = 0
incoming_like_x = 0
incoming_like_match = 0
match_from_like = 0
match_from_like_with_msg = 0
match_from_like_no_msg = 0
like_sent_with_msg = 0
like_sent_no_msg = 0
like_with_no_resp = 0
you_unmatched = 0
num_msgs = []
key_set = set()
for row in matches_data:
    key_set.add(tuple(row.keys()))
    if 'we_met' in row:
        we_met += 1
    if 'match' in row:
        match += 1
    if 'chats' in row:
        chats += 1
    if 'like' in row:
        like += 1
        if 'comment' in row['like'][0]['like'][0]:
            like_sent_with_msg += 1
            if 'match' in row:
                match_from_like_with_msg += 1
        else:
            like_sent_no_msg += 1
            if 'match' in row:
                match_from_like_no_msg += 1
    if 'block' in row:
        block += 1
    if 'like' in row and 'match' in row:
        match_from_like += 1
    if 'match' in row and 'block' in row:
        you_unmatched += 1
    if not 'match' in row and 'block' in row:
        incoming_like_x += 1
    if 'match' in row and not 'like' in row:
        incoming_like_match += 1
    if 'match' in row:
        if not 'chats' in row:
            num_msgs.append(0)
        else:
            num_msgs.append(len(row['chats']))
    if 'like' in row and not 'match' in row:
        like_with_no_resp += 1
print(f"We met: {we_met}")
print(f"Match: {match}")
print(f"Chats: {chats}")
print(f"Like: {like}")
print(f"Block: {block}")
print(f"Key set: {key_set}")
print(f"Match from like: {match_from_like}")
print(f"Like sent with msg: {like_sent_with_msg}")
print(f"Like sent no msg: {like_sent_no_msg}")
print(f"Match from like with msg: {match_from_like_with_msg}")
print(f"Match from like no msg: {match_from_like_no_msg}")
print(f"You unmatched: {you_unmatched}")
print(f"Incoming like x: {incoming_like_x}")
print(f"Incoming like match: {incoming_like_match}")
print(f"Like with no resp: {like_with_no_resp}")
print(f"Num msgs: {num_msgs}")