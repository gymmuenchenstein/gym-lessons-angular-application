export interface CalendarDataConfig {
    dataPath: string,
    teachers: { file: string, fields: string[] },
    entries: { files: string[], fields: string[] }
}
