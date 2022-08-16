
# `Store`
Base class used to create a contextual observable store.
```js

```


```js

class ClientStore extends Store {

```
            

## Instance Members
<table><thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Example</th></tr></thead><tbody>
<tr><td>

`stateHistory`

</td><td>

``Array``

</td><td>Exposes store state history only if settings had "trackStateHistory: true" set.</td><td>



</td></tr>
<tr><td>

`stateChanged`

</td><td>

``Observable``

</td><td>Provides RxJS Observable that can be subscribed to in order to retrieve store changes.</td><td>



```js

// Subscribe

```
            


</td></tr>
<tr><td>

`stateChangedWithName`

</td><td>

``Observable``

</td><td>Provides RxJS Observable that can be subscribed to in order to retrieve store changes and state name.</td><td>



```js

// Subscribe

```
            


</td></tr>
<tr><td>

`stateChangedNoPayload`

</td><td>

``Observable``

</td><td>Provides RxJS Observable that can be subscribed to in order to be notified of store changes.</td><td>



```js

// Subscribe

```
            


</td></tr>
<tr><td>

`stateChangedNoPayloadWithName`

</td><td>

``Observable``

</td><td>Provides RxJS Observable that can be subscribed to in order to be notified of store changes with state name.</td><td>



```js

// Subscribe

```
            


</td></tr>
<tr><td>

`stateChangedProperties`

</td><td>

``Observable``

</td><td>Provides RxJS Observable that can be subscribed to in order to retrieve store changes,



```js

// Subscribe

```
            


</td></tr>
<tr><td>

`stateChangedPropertiesWithName`

</td><td>

``Observable``

</td><td>Provides RxJS Observable that can be subscribed to in order to retrieve store changes,



```js

// Subscribe

```
            


</td></tr>
<tr><td>

`getStateChangedProperties`

</td><td>

``

</td><td></td><td>



</td></tr>
</tbody></table>

## Instance Functions
<table><thead><tr><th>Name</th><th>Description</th><th>Parameters</th><th>Return</th><th>Example</th></tr></thead><tbody>
<tr><td>

`getState`

</td><td>Gets store state.</td><td>

deepCloneReturnedState {`boolean`} - When true, returns a cloned copy of the store state (recommended).

</td><td>

{`Object`} - Store state to return.

</td><td>



</td></tr>
<tr><td>

`getStateProperty`

</td><td>Gets store state for a given property.</td><td>

propertyName {`String`} - Name of the property to return from the store state.

 deepCloneReturnedState {`Boolean`} - When true, returns a cloned copy of the store state (recommended).

</td><td>

{`Object`} - Store state to return.

</td><td>



</td></tr>
<tr><td>

`setState`

</td><td>Sets store state.

state {`Object`|`function`} - State to set, can be an object or a function that accepts latest state as input parameter.

 action {`String`} - Descriptive name for state action, e.g. "CLIENT_ADD".

 dispatchState {`Boolean`} - When true, notifies subscribers of state changes.

 deepCloneState {`Boolean`} - When true, clones latest state before performing state update.

</td><td>

{`Object`} - Latest store state.

</td><td>



</td></tr>
<tr><td>

`clearState`

</td><td>Clears store state.</td><td>

dispatchState {`boolean`} - When true, notifies subscribers of state changes.

</td><td>

{`void`} - 

</td><td>



</td></tr>
<tr><td>

`resetState`

</td><td>Resets store state, includes clearing store state history.</td><td>

state {`Object`} - State to set.

 dispatchState {`boolean`} - When true, notifies subscribers of state changes.

</td><td>

{`void`} - 

</td><td>



</td></tr>
<tr><td>

`clearStateHistory`

</td><td>Clears store state history.</td><td>



</td><td>

{`void`} - 

</td><td>



</td></tr>
</tbody></table>


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)




# `StoreStateSettings`
Settings for [Store](#store) constructor.

## Instance Members
<table><thead><tr><th>Name</th><th>Type</th><th>Description</th><th>Example</th></tr></thead><tbody>
<tr><td>

`persistence`

</td><td>

``

</td><td>{"memory"|"sessionStorage|"localStorage"} [persistence="memory"] Where to persist store data to:



</td></tr>
<tr><td>

`trackStateHistory`

</td><td>

``

</td><td>[trackStateHistory=false] When true, stores the state mutation history.



</td></tr>
<tr><td>

`logStateChanges`

</td><td>

``

</td><td>[logStateChanges=false] When true, logs the state mutation history to console.</td><td>



</td></tr>
</tbody></table>


![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/aqua.png)
