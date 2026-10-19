#!/usr/bin/env python3
"""Rebuilds src/data/counties-2026.json (county -> locality pay area) from the OPM page
"2026 Locality Pay Area Definitions" saved in research/opm-2026-locality-definitions.html.
Source: https://www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/2026/locality-pay-area-definitions/
Usage: python3 scripts/data/build-locality-counties.py"""
import re, html, json, os
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
t = open(os.path.join(ROOT, 'research', 'opm-2026-locality-definitions.html'), errors='ignore').read()
t = t[t.find('2026 Locality Pay Area Definitions'):]
gs = json.load(open(os.path.join(ROOT, 'src', 'data', 'gs-2026.json')))
by_name = {a['name']: a['code'] for a in gs['areas']}
by_name['Alaska'] = 'AK'; by_name['Hawaii'] = 'HI'
area = None; state = None; rows = []
for m in re.finditer(r'<(h3|h4)[^>]*>(.*?)</\1>|<tr[^>]*>(.*?)</tr>', t, re.S):
    if m.group(1) == 'h3':
        name = html.unescape(re.sub('<[^>]+>', '', m.group(2))).strip()
        area = by_name.get(name)
        if name in ('Rest of U.S.',): break
    elif m.group(1) == 'h4':
        state = html.unescape(re.sub('<[^>]+>', '', m.group(2))).strip()
    elif area:
        cells = [html.unescape(re.sub('<[^>]+>', '', c)).strip() for c in re.findall(r'<td[^>]*>(.*?)</td>', m.group(3), re.S)]
        if len(cells) >= 2 and re.match(r'^\d{2,}', cells[1]):
            rows.append({'place': cells[0], 'fips': cells[1], 'area': area, 'state': state or cells[0]})
# State name for each row: the FIPS state code is the first two digits.
ST = {}
for r in rows:
    ab = re.search(r', ([A-Z]{2})$', r['place'])
    if ab: ST[r['fips'][:2]] = ab.group(1)
ST['02'] = 'AK'; ST['15'] = 'HI'
out = {}
for r in rows:
    st = ST.get(r['fips'][:2])
    if not st: continue
    out.setdefault(st, []).append([re.sub(r', [A-Z]{2}$', '', r['place']), r['area']])
for st in out: out[st].sort()
missing = set(by_name.values()) - {a for v in out.values() for _, a in v} - {'RUS'}
assert not missing, f'areas without county: {missing}'
json.dump({'source_url': 'https://www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/2026/locality-pay-area-definitions/', 'states': dict(sorted(out.items()))}, open(os.path.join(ROOT, 'src', 'data', 'counties-2026.json'), 'w'), separators=(',', ':'))
print(len(rows), 'places in', len(out), 'states')
