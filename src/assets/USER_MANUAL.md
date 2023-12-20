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
Ad, 2024, 1, 22, 2, KS, M1i, P009, 0, , 360, 855,  45,
Ad, 2024, 1, 22, 3, M,  F3a, P009, 0, , 244, 1000, 45,
Ad, 2024, 1, 22, 4, M,  F3a, P009, 0, , 244, 1055, 45,
Ad, 2024, 1, 22, 6, M,  F3c, 138,  0, , 267, 1245, 45,
Ad, 2024, 1, 22, 7, M,  F3c, 138,  0, , 267, 1340, 45,
Ad, 2024, 1, 22, 8, M,  M1i, 138,  0, , 64,  1435, 45,
Ad, 2024, 1, 22, 9, M,  M1i, 138,  0, , 64,  1530, 45,
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
