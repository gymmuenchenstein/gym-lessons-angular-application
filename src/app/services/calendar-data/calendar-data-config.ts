export interface CalendarDataConfig {
    dataPath: string,
    teachers: { file: string, fields: string[] },
    lessons: { file: string, fields: string[] },
    plans: [
        {
            plan: string,
            route: string,
            files: [
                { path: string, fields: string[] }
            ]
        }
    ]
}
