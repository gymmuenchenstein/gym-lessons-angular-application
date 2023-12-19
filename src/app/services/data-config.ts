export interface DataConfig {
    dataPath: string,
    teachers: { file: string, fields: string[] },
    entries: { files: string[], fields: string[] }
}
