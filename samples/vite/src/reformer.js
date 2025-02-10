import { ObjectReformer } from '@techart-software/json-reformer';

export function setupReformer(inputElement, modelELement, outputElement, reformButton) {
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

  }
  reformButton.addEventListener('click', () => reform())
}
