import datetime
version = datetime.datetime.now().strftime('%Y.%m.%d.%H')
with open('ui/src/app/version.ts', 'w') as v:
    v.write(f"export const VERSION = '{version}';\n")