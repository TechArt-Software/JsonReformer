export function modifyJson(inputJson: string, modifier: (data: any) => any): string {
    try {

        console.log(" JSON:", inputJson); // Log the input JSON

        const parsedData = JSON.parse(inputJson);
       
        parsedData.name = parsedData.name + "_modified";

        return JSON.stringify(parsedData);
    } catch (error) {
        throw new Error("Invalid JSON input");
    }
}
