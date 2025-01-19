// Import the library
import { modifyJson } from '@techart-software/json-reformer';

// Input JSON string
const inputJson = '{"name": "Babak", "age": 25}';

// Use the modifyJson function
const modifiedJson = modifyJson(inputJson, (data) => {
    data.age += 2; // Increment age by 2
    data.isSenior = data.age > 60; // Add a field to indicate senior status
    return data;
});

// Log the result
console.log("Original JSON:", inputJson);
console.log("Modified JSON:", modifiedJson);