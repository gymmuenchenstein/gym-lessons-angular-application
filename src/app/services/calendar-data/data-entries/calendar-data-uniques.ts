export class CalendarDataUniques {
    indices: number[] = []
    teachers: { surname: string, name: string, abbr: string }[] = []
    rooms: string[] = []
    lessons: { full: string, short: string }[] = []
    classes: string[] = []

    complete() {
        this.indices.sort((a, b) => {
            return a > b ? 1 : -1
        })
        this.teachers.sort((a, b) => {
            return a.abbr.charCodeAt(0) > b.abbr.charCodeAt(0) || (a.abbr.charCodeAt(0) == b.abbr.charCodeAt(0) && a.abbr.charCodeAt(1) > b.abbr.charCodeAt(1)) ? 1 : -1
        });
        this.rooms.sort();
        this.lessons.sort();
        this.classes.sort();
    }
}
