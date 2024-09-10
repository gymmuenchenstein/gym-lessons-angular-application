export interface CalendarDataConfig {
    dataPath: string,
    defaultPlan: string,
    teachers: { file: string, fields: string[] },
    lessons: { file: string, fields: string[] },
    plans: [
        {
            plan: string,
            route: string,
            hidden?: string,
            files: [
                { path: string, fields: string[] }
            ]
        }
    ]
}
