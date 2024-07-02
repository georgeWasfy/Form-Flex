# Form-Builder

  

<a  alt="Nx logo"  href="https://nx.dev"  target="_blank"  rel="noreferrer"><img  src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png"  width="45"></a>

  

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

  

## Description

  

A schema based dynamic form builder with a drag and drop interface built with react.

  

## Supported Layouts

  

- :white_check_mark: Horizontal Layout

  

- :white_check_mark: Vertical Layout

  

- :white_check_mark: Accordion Layout

  

- :white_check_mark: Multi-step Layout

  

By default, there are 3 different layouts GroupAccordionLayout,VerticalLayout and HorizontalLayout, these core layouts are detailed in the following.

  

### HorizontalLayout

  

Renders all child elements in a horizontal display, with all child elements having equal width and spacing.

  

### VerticalLayout

  

Renders all child elements in a vertical display, with all child elements the entire width of the layout.

  

### GroupAccordionLayout

  

Renders all child elements inside a togglable accordion.



### MultistepLayout

  

Renders a multi-step form layout with configurable number of steps.

  

<em>Layouts can be nested inside each other to acheive complex form structure</em>

  

## Supported Form Elements

  

- :white_check_mark: Date Field

  

- :white_check_mark: Datetime Field

  

- :white_check_mark: Select Field

  

- :white_check_mark: Multi-Select Field

  

- :white_check_mark: Text Field

  

- :white_check_mark: Text-Area Field

  

- :white_check_mark: Number Field

  

- :x: File Upload Field

  

- :x: Multi-File Upload Field

  

## Conditional Rendering (WIP)

  

Conditionally apply an `effect` to a ui form elements based on another element's `condition`.

  

#### Supported effects

  

- HIDE: Hides the form element from the rendered form.

- SHOW: Shows the form element in the rendered form.

- DISABLE: Disables the form element in the rendered form.

- ENABLE: Enables the form element in the rendered form.

  
## Element Properties
Each element has different set of properties that can be customized by clicking on the element in the drop zone
### Base Properties:

 - Label: An optional text that appear above the input field
 - Name: The key name that will appear in the submitted json associated with the value for that input field (by default it is a generated unique id)
 - Description: An optional text that appear below the input field
 - Required: A boolean field to control whether this input field is required in the form
 ### Drop Down Field Properties
 
 - Option Label: The label that will appear inside the dropdown options
 - Option Value: The value that is associated with the label
### Text Area Field Properties
 - Height: The height for the text area input field


## Preview

![demo](./demo.gif)

  

## Getting started

  

To run the project with Nx use the following syntax:

  

```
npx nx serve form-builder
```

  

Browse to: http://127.0.0.1:4200/form-builder