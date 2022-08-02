# omni-label

A simple label component that renders a styled text string.

```js 
import '@innofake/omni-components/label'; 
```

## Example

```html
<omni-label
```

## Properties

| Property   | Attribute | Modifiers | Type                                             | Default   | Description                                      |
|------------|-----------|-----------|--------------------------------------------------|-----------|--------------------------------------------------|
| `label`    | `label`   |           | `String`                                         |           | The label string to display.                     |
| `override` |           |           |                                                  |           | The element style template.                      |
| `styles`   |           | readonly  | `CSSResult[]`                                    |           |                                                  |
| `type`     | `type`    |           | `"default"\|"title"\|"subtitle"\|"strong"\|String` | "default" | The type of label to display:

## CSS Custom Properties

| Property                            | Description                 |
|-------------------------------------|-----------------------------|
| `--omni-label-cursor`               | Label cursor.               |
| `--omni-label-default-font-size`    | Default label font size.    |
| `--omni-label-default-font-weight`  | Default label font weight.  |
| `--omni-label-font-color`           | Label font color.           |
| `--omni-label-font-family`          | Label font family.          |
| `--omni-label-font-size`            | Label font size.            |
| `--omni-label-font-weight`          | Label font weight.          |
| `--omni-label-strong-font-size`     | Strong label font size.     |
| `--omni-label-strong-font-weight`   | Strong label font weight.   |
| `--omni-label-subtitle-font-size`   | Subtitle label font size.   |
| `--omni-label-subtitle-font-weight` | Subtitle label font weight. |
| `--omni-label-title-font-size`      | Title label font size.      |
| `--omni-label-title-font-weight`    | Title label font weight.    |