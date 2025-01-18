export function modifyJson(inputJson: string, modifier: (data: any) => any): string {
    try {
        const parsedData = JSON.parse(inputJson);
        parsedData.name = parsedData.name + "Modified";
        const modifiedData = modifier(parsedData);
        return JSON.stringify(modifiedData, null, 2);
    } catch (error) {
        throw new Error("Invalid JSON input");
    }
}
