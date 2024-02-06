## 1. Updating the calendar
1. Leave the new .csv file in the *assets/data/* folder
2. Then update *assets/calendar-data.config.json* to include the new file in this way:
```json
...
"files": [
  "an-example-file.csv"
]
...
```
3. Make sure the .csv doesn't include in-file-headers and the fields in the *assets/calendar-data.config.json* are set accordingly. If not, rearrange them. Leave unused columns as an empty string.
```json
...
"fields": ["abbr", "year", "month", "day", "index", "lesson", "class", "room", "", "", "", "time", "duration", ""]
...
```
```csv
Aa, 2024, 1, 22, 8,  IN,  M1g, 112, 0, , 563, 1435, 45,
Aa, 2024, 1, 22, 9,  IN,  M1g, 112, 0, , 563, 1530, 45,
Aa, 2024, 1, 23, 8,  INP, M1g, 230, 0, , 911, 1435, 45,
Aa, 2024, 1, 23, 9,  INP, M1g, 230, 0, , 911, 1530, 45,
Aa, 2024, 1, 23, 10, fIN, M1e, 230, 0, , 882, 1625, 45,
Aa, 2024, 1, 23, 10, fIN, M1l, 230, 0, , 882, 1625, 45,
```
4. Your *assets/calendar-data.config.json* should look something like this:
```json
{
    "dataPath": "data/",
    "teachers": {
        "file": "the-abbreviations-for-the-teachers-file.csv",
        "fields": ["teacher", "abbr"]
    },
    "entries": {
        "files": [
            "all-the-calendar-entries-file-1.csv",
            "all-the-calendar-entries-file-2.csv"
        ],
        "fields": ["abbr", "year", "month", "day", "index", "", "lesson", "class", "room", "time", "duration", "", ""]
    }
}

```
> **Note!**  
> The `files:` can include multiple .csv if required.

> **Warning!**  
> Do not change the `fields`-names as they are technical labels.

> **Warning!**  
> Make sure to save the .csv files with *UTF-8 BOM* encoding, otherwise the functionality for entries with mutated vowels is restricted.
