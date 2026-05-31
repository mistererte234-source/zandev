import urllib.request
import re

req = urllib.request.Request('https://unsplash.com/photos/1zj1gFh7pNQ', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    match = re.search(r'property="og:image"\s+content="([^"]+)"', html)
    if match:
        print(match.group(1))
    else:
        print('not found')
except Exception as e:
    print(e)
