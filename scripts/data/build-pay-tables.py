#!/usr/bin/env python3
"""Rebuilds src/data/pay-2026.json from the OPM XML salary tables (research/opm-2026-xml/*.xml).
Re-run each January after downloading the new year's XML files from
https://www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/<year>/general-schedule/
Usage: python3 scripts/data/build-pay-tables.py [year]"""
import json, re, glob, os, sys
YEAR = sys.argv[1] if len(sys.argv) > 1 else '2026'
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC = os.path.join(ROOT, 'research', f'opm-{YEAR}-xml')
# Short display names and URL slugs (our own), keyed by the OPM table code.
SHORT = {
 'AQ': ('Albany', 'albany'), 'AL': ('Albuquerque', 'albuquerque'), 'ATL': ('Atlanta', 'atlanta'), 'AU': ('Austin', 'austin'),
 'BH': ('Birmingham', 'birmingham'), 'BOS': ('Boston', 'boston'), 'BU': ('Buffalo', 'buffalo'), 'BN': ('Burlington', 'burlington'),
 'CC': ('Charlotte', 'charlotte'), 'CHI': ('Chicago', 'chicago'), 'CIN': ('Cincinnati', 'cincinnati'), 'CLE': ('Cleveland', 'cleveland'),
 'CS': ('Colorado Springs', 'colorado-springs'), 'COL': ('Columbus', 'columbus'), 'CT': ('Corpus Christi', 'corpus-christi'),
 'DFW': ('Dallas-Fort Worth', 'dallas-fort-worth'), 'DV': ('Davenport', 'davenport'), 'DAY': ('Dayton', 'dayton'), 'DEN': ('Denver', 'denver'),
 'DM': ('Des Moines', 'des-moines'), 'DET': ('Detroit', 'detroit'), 'FN': ('Fresno', 'fresno'), 'HB': ('Harrisburg', 'harrisburg'),
 'HAR': ('Hartford', 'hartford'), 'HOU': ('Houston', 'houston'), 'HNT': ('Huntsville', 'huntsville'), 'IND': ('Indianapolis', 'indianapolis'),
 'KC': ('Kansas City', 'kansas-city'), 'LR': ('Laredo', 'laredo'), 'LV': ('Las Vegas', 'las-vegas'), 'LA': ('Los Angeles', 'los-angeles'),
 'MFL': ('Miami', 'miami'), 'MIL': ('Milwaukee', 'milwaukee'), 'MSP': ('Minneapolis', 'minneapolis'), 'NY': ('New York', 'new-york'),
 'OM': ('Omaha', 'omaha'), 'PB': ('Palm Bay', 'palm-bay'), 'PHL': ('Philadelphia', 'philadelphia'), 'PX': ('Phoenix', 'phoenix'),
 'PIT': ('Pittsburgh', 'pittsburgh'), 'POR': ('Portland', 'portland'), 'RA': ('Raleigh', 'raleigh'), 'RN': ('Reno', 'reno'),
 'RCH': ('Richmond', 'richmond'), 'RT': ('Rochester', 'rochester'), 'SAC': ('Sacramento', 'sacramento'), 'SN': ('San Antonio', 'san-antonio'),
 'SD': ('San Diego', 'san-diego'), 'SF': ('San Francisco', 'san-francisco'), 'SEA': ('Seattle', 'seattle'), 'SO': ('Spokane', 'spokane'),
 'SL': ('St. Louis', 'st-louis'), 'TU': ('Tucson', 'tucson'), 'VB': ('Virginia Beach', 'virginia-beach'), 'DCB': ('Washington DC', 'washington-dc'),
 'RUS': ('Rest of U.S.', 'rest-of-us'), 'AK': ('Alaska', 'alaska'), 'HI': ('Hawaii', 'hawaii'),
}
def parse(path):
    t = open(path, encoding='utf-8-sig').read()
    desc = re.search(r'<Description>(.*?)</Description>', t, re.S).group(1)
    grades = re.findall(r'<Grade>(.*?)</Grade>', t, re.S)
    annual, hourly, capped = [], [], []
    for g in grades:
        steps = re.findall(r'<Annual>(\d+)</Annual>\s*<Hourly>([\d.]+)</Hourly>.*?<Statutory_Cap_Applies>(\w+)</Statutory_Cap_Applies>\s*<Value>(\d+)</Value>', g, re.S)
        steps.sort(key=lambda s: int(s[3]))
        annual.append([int(s[0]) for s in steps]); hourly.append([float(s[1]) for s in steps]); capped.append([s[2] == 'true' for s in steps])
    num = re.findall(r'<Value>(\d+)</Value>\s*</Grade>', t)
    return desc, annual, hourly, capped
out = {'year': int(YEAR), 'source': f'OPM {YEAR} General Schedule salary tables (XML data)', 'source_url': f'https://www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/{YEAR}/general-schedule/', 'areas': []}
desc, base, bh, _ = parse(os.path.join(SRC, 'GS.xml'))
assert len(base) == 15 and all(len(r) == 10 for r in base), 'GS base table must be 15 x 10'
out['base'] = base; out['baseHourly'] = bh
out['raise'] = float(re.search(r'Incorporating the ([\d.]+)% General Schedule Increase', desc).group(1))
for f in sorted(glob.glob(os.path.join(SRC, '*.xml'))):
    code = os.path.basename(f)[:-4]
    if code == 'GS': continue
    d, a, h, c = parse(f)
    pct = float(re.search(r'Locality Payment of ([\d.]+)%', d).group(1))
    m = re.search(r'For the Locality Pay Area of (.*)', d)
    name = m.group(1).strip() if m else d.split('\n')[2].strip()
    if code not in SHORT: sys.exit(f'Unknown table code {code}: add it to SHORT')
    out['areas'].append({'code': code, 'name': name, 'short': SHORT[code][0], 'slug': SHORT[code][1], 'pct': pct, 'annual': a, 'hourly': h, 'capped': c})
out['areas'].sort(key=lambda x: (x['code'] == 'RUS', x['short']))
cap = max(v for a in out['areas'] for g, r in enumerate(a['annual']) for s, v in enumerate(r) if a['capped'][g][s])
# Previous year's base table and locality percentages, for the raise comparison.
PREV = os.path.join(ROOT, 'research', f'opm-{int(YEAR) - 1}-xml')
pdesc, pbase, _, _ = parse(os.path.join(PREV, 'GS.xml'))
prevPct = {}
for f in glob.glob(os.path.join(PREV, '*.xml')):
    code = os.path.basename(f)[:-4]
    if code == 'GS': continue
    prevPct[code] = float(re.search(r'Locality Payment of ([\d.]+)%', parse(f)[0]).group(1))
print(len(out['areas']), 'locality areas; raise', out['raise'], '%; cap', cap)
# Full tables (every cell as published) for the tests: research/, never shipped to the browser.
json.dump(out, open(os.path.join(ROOT, 'research', f'opm-{YEAR}-tables.json'), 'w'), separators=(',', ':'))
# Compact file read by the engine: the base table, the percentages and the cap rebuild every cell.
small = {'year': out['year'], 'source_url': out['source_url'], 'raise': out['raise'], 'cap': cap, 'base': base,
         'prev': {'year': int(YEAR) - 1, 'raise': float(re.search(r'Incorporating the ([\d.]+)% General', pdesc).group(1)), 'base': pbase},
         'areas': [{k: a[k] for k in ('code', 'name', 'short', 'slug', 'pct')} | {'prevPct': prevPct.get(a['code'])} for a in out['areas']]}
json.dump(small, open(os.path.join(ROOT, 'src', 'data', f'gs-{YEAR}.json'), 'w'), indent=1)
