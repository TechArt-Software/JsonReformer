import './style.css'
import { setupReformer } from './reformer.js'

document.querySelector('#app').innerHTML = `
<div style="display: flex; flex-direction: column; align-items: center;"> 
    <h2>JSON Reformer Demo</h2>

    <div style="display: flex; align-items: center; margin-bottom: 10px;"> 
        <label for="jsonInput" style="margin-right: 10px;">Input →</label>
        <textarea id="jsonInput" rows="10" cols="100" placeholder="Enter Source JSON here...">
{
  "name": "John Doe",
  "age": 30,
  "city": "Ottawa",
  "country": "CA",
  "occupation": "Software Developer"
}
        </textarea>
    </div>

    <h3>+</h3> 

    <div style="display: flex; align-items: center; margin-bottom: 10px;"> 
        <label for="jsonModel" style="margin-right: 10px;">Model →</label>
        <textarea id="jsonModel" rows="10" cols="100" placeholder="Enter Reformer Model JSON here...">
{
  "reformers": [
    {
      "name": "Babak AJ",
      "city": "Toronto",
      "occupation": "Software Architect"
    }
  ]
}
        </textarea>
    </div>

    <button id="reform" type="button">↓</button>
    <h3></h3>

    <div style="display: flex; align-items: center;"> 
        <label for="jsonOutput" style="margin-right: 10px;">Output →</label>
        <textarea id="jsonOutput" rows="10" cols="100" placeholder="Reformed JSON will appear here"></textarea>
    </div>
</div>
`

setupReformer(document.querySelector('#jsonInput'), document.querySelector('#jsonModel'),  document.querySelector('#jsonOutput'), document.querySelector('#reform'));
