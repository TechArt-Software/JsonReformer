# JSON Reformer

**JSON Reformer** is a user-friendly and highly customizable JSON transformation tool. It is lightweight, ES6-compatible transformation engine that allows you to **programmatically modify any JSON object using declarative rules** plus optional inline scripts.

## Overview

JSON Reformer works with three components:

1. **Input JSON** – the original data
2. **Reformer JSON** – a declarative transformation model
3. **Output JSON** – the transformed result

The reformer model can:
- Modify primitive values
- Update deeply nested properties
- Perform arithmetic or logical operations
- Filter, project, and sort arrays
- Apply global or per-rule scripts

---

## Features

- ES6-compatible scripting
- Dot and array path notation
- Rule-level and global scripts
- Fluent array transformation syntax
- Non-destructive (only declared paths are modified)
- Works in browser and Node.js environments

---

## Basic Example

### Input JSON

```json
{
  "number": 44,
  "boolean": true
}
```

### Reformer JSON

```json
{
  "reformers": [
    { "number": 4 },
    { "boolean": false }
  ]
}
```

### Output JSON

```json
{
  "number": 4,
  "boolean": false
}
```

## Reformer JSON Structure

```json
{
  "reformers": [
    {
      "<json-path>": <newValue>,
      "scripts": [  //-- Optional script to write ES6 script to modify the "<json-path>"
        {
          "body": "<ES6 function body>"
        }
      ]
    }
  ],
  "scripts": [
    {
      "body": "<ES6 function body>"
    }
  ]
}
```

### Properties
| Field       | Description                             |
| ----------- | --------------------------------------- |
| `reformers` | Array of transformation rules           |
| `json-path` | Target path (dot + array notation)      |
| `scripts`   | Optional script(s) applied to this rule |
| `body`      | ES6 function body returning final value |
| `action`    | Optional array action (e.g. `filter`)   |


### JSON Path Syntax

| Syntax           | Description          |
| ---------------- | -------------------- |
| `a.b.c`          | Nested object access |
| `array[0]`       | Array index access   |
| `array[2].value` | Nested array object  |

### Example:

```json
{
  "object.c": "c"
}
```

## Scripts

Scripts allow dynamic value calculation instead of static replacement.

### Script Context Variables
| Variable       | Description                       |
| -------------- | --------------------------------- |
| `currentValue` | Existing value at the target path |
| `newValue`     | Value defined in the reformer     |
| `root`         | The original root JSON object     |

### Example: Arithmetic Update
```json
{
  "array[2].three": 2,
  "scripts": [
    {
      "body": "return currentValue + newValue"
    }
  ]
}
```

### Global Scripts
Global scripts act as defaults when a reformer rule does not define its own script.
```json
{
  "scripts": [
    {
      "body": "return newValue"
    }
  ]
}
```

### Array Transformations
JSON Reformer supports fluent array operations using a script action.

#### Sample Supported Actions
- filter
- select
- where
- orderBy

#### Example: Filtering and Projection
```json
{
  "employees": [],
  "scripts": [
    {
      "action": "filter",
      "body": "
        .select(e => ({ name: e.name, age: e.age }))
        .where(e => e.age >= 25 && e.age <= 40)
        .orderBy(e => [e.name, e.age])
      "
    }
  ]
}
```

## Complete Example
Input JSON
```json
{
  "array": [
    { "one": 11 },
    { "two": 22 },
    { "three": 33 }
  ],
  "boolean": true,
  "null": null,
  "number": 44,
  "object": { "a": "b", "c": "d" },
  "string": "Hello World",
  "employees": [
    { "name": "John", "age": 30, "gender": "male" },
    { "name": "Tom", "age": 25, "gender": "male" },
    { "name": "Jim", "age": 40 },
    { "name": "Jolie", "age": 35, "gender": "female" },
    { "name": "Ali", "age": 37 }
  ]
}
```
Reformer JSON
```json
{
  "reformers": [
    {
      "array[2].three": 2,
      "scripts": [
        {
          "body": "return currentValue + newValue"
        }
      ]
    },
    { "boolean": false },
    { "number": 4 },
    { "object.c": "c" },
    { "string": "changed hello" },
    {
      "employees": [],
      "scripts": [
        {
          "action": "filter",
          "body": "
            .select(e => ({ name: e.name, age: e.age }))
            .where(e =>
              e.age >= 25 &&
              e.age <= 40 &&
              e.name.toLowerCase().includes('i')
            )
            .orderBy(e => [e.name, e.age])
          "
        }
      ]
    }
  ],
  "scripts": [
    {
      "body": "return newValue"
    }
  ]
}
```
Output JSON
```json
{
  "array": [
    { "one": 11 },
    { "two": 22 },
    { "three": 35 }
  ],
  "boolean": false,
  "null": null,
  "number": 4,
  "object": { "a": "b", "c": "c" },
  "string": "changed hello",
  "employees": [
    { "name": "Ali", "age": 37 },
    { "name": "Jim", "age": 40 },
    { "name": "Jolie", "age": 35 }
  ]
}
```

## Usage Example
```JavaScript
import { ObjectReformer } from '@techart-software/json-reformer';

export function setupReformer(
  inputElement,
  modelELement,
  outputElement,
  reformButton
) {
  const reform = () => {
    const input = inputElement.value;
    const model = modelELement.value;

    try {
      const parsedInput = JSON.parse(input);
      const parsedModel = JSON.parse(model);

      const reformer = ObjectReformer(parsedModel);
      const output = reformer.reform(parsedInput);

      outputElement.textContent = JSON.stringify(output, null, 2);
    } catch (error) {
      outputElement.textContent = "Invalid JSON!\r\n" + error;
    }
  };

  reformButton.addEventListener('click', reform);
}
```

[Try Json Reformer](https://techart-software.github.io/JsonReformer)