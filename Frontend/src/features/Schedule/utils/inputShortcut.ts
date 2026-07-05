type CommandHandler = (template: string, count: number) => string[] | null;

const numberCommand: CommandHandler = (template, count) => {
    if (!template.includes("[number]")) return null;
    return Array.from({ length: count }, (_, i) =>
        template.replace(/\[number\]/g, String(i + 1))
    );
};

const commands: CommandHandler[] = [
    numberCommand,
    // add more here as you build them
];

export function generateTitles(template: string, count: number): string[] {
    for (const command of commands) {
        const result = command(template, count);
        if (result) return result;
    }
    // no command matched -> same title repeated for every date
    return Array.from({ length: count }, () => template);
}