import './style.css'
import { setupReformer } from './reformer.js'

document.querySelector('#app').innerHTML = `
<div style="display: flex; flex-direction: column; align-items: center;"> 
    <h2>JSON Reformer Demo</h2>

    <div style="display: flex; align-items: center; margin-bottom: 10px; width: 100%; justify-content: center;"> 
        <label for="jsonInput" style="margin-right: 10px; align-self: center;">Input →</label>
        <textarea id="jsonInput" rows="10" cols="60" placeholder="Enter Source JSON here..." style="height: 180px;">
{
  "name": "John Doe",
  "age": 30,
  "city": "Ottawa",
  "country": "CA",
  "occupation": "Software Developer"
}
        </textarea>
        <div style="margin-left: 10px; width: 450px; height: 180px; background-color: #1e1e1e; color: #d4d4d4; font-family: 'Courier New', monospace; display: flex; align-items: center; padding: 10px; border-radius: 5px; overflow: auto;">
            <pre style="margin: 0; text-align: left;">
<span style="color: #569CD6;">const</span> inputObject = JSON.<span style="color: #DCDCAA;">parse</span>(input);
            </pre>
        </div>
    </div>

    <h3>+</h3> 

    <div style="display: flex; align-items: center; margin-bottom: 10px; width: 100%; justify-content: center;"> 
        <label for="jsonModel" style="margin-right: 10px; align-self: center;">Model →</label>
        <textarea id="jsonModel" rows="15" cols="60" placeholder="Enter Reformer Model JSON here..." style="height: 270px;">
{
  "reformers": [
    {
      "name": "Babak AJ"
    },
    {
      "city": "Toronto"
    },
    {  
      "occupation": "Software Architect"
    }
  ]
}
        </textarea>
        <div style="margin-left: 10px; width: 450px; height: 270px; background-color: #1e1e1e; color: #d4d4d4; font-family: 'Courier New', monospace; display: flex; align-items: center; padding: 10px; border-radius: 5px; overflow: auto;">
            <pre style="margin: 0; text-align: left;">
<span style="color: #569CD6;">const</span> modelObject = JSON.<span style="color: #DCDCAA;">parse</span>(model); 
<span style="color: #569CD6;">const</span> reformer = <span style="color: #DCDCAA;">ObjectReformer</span>(modelObject);
<span style="color: #569CD6;">const</span> output = reformer.<span style="color: #DCDCAA;">reform</span>(inputObject);
            </pre>
        </div>
    </div>

    <button id="reform" type="button">↓</button>
    <h3></h3>

    <div style="display: flex; align-items: center; width: 100%; justify-content: center;"> 
        <label for="jsonOutput" style="margin-right: 10px; align-self: center;">Output →</label>
        <textarea id="jsonOutput" rows="10" cols="60" placeholder="Reformed JSON will appear here" style="height: 180px;"></textarea>
        <div style="margin-left: 10px; width: 450px; height: 180px; background-color: #1e1e1e; color: #d4d4d4; font-family: 'Courier New', monospace; display: flex; align-items: center; padding: 10px; border-radius: 5px; overflow: auto;">
            <pre style="margin: 0; text-align: left;">
<span style="color: #569CD6;">const</span> output = JSON.<span style="color: #DCDCAA;">stringify</span>(outputObject);
            </pre>
        </div>
    </div>
</div>

`

setupReformer(document.querySelector('#jsonInput'), document.querySelector('#jsonModel'),  document.querySelector('#jsonOutput'), document.querySelector('#reform'));
