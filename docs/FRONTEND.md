# Frontend

## Contents
1. [Frontend Technologies](#frontend-technologies)
2. [File Structure](#file-structure)

## Frontend Technologies

## File Structure

The structure of the frontend is pretty basic for a React TS project.

The `src` folder contains all relevant code that is rendered, with any files outside of it mainly being used for configuration.

Here are the subdirectories of `src`.

- `assets`
    - Contains all media assets necessary for the program.
        - `.png`, `.svg`, ... files.

- `components`
    - Contains all rendered components in the app. All components except for page parent components are kept here in subdirectories named after the corresponding page for the elements within it.
        - There is also a `Shared` components folder for components that do not correspond to one subdirectory specifically.
            - Header & Footer for example.

- `css`
    - Simply contains all the CSS files needed for styling the app.

- `hooks`
    - Stores all hooks used in the app.
    - [Hooks](https://www.w3schools.com/react/react_hooks.asp#:~:text=Hooks%20were%20added%20to%20React,to%20remove%20classes%20from%20React.) contain functionality used throughout the app rather than component-specific logic. They allow you to access state without class components.
- `pages`
    - Contains all parent page components that are rendered in the app. So any page that is routed into `App.tsx`.
        - `Home`, `Profile`, `Dashboard`, ...
        - Pages are also the options you select in the navbar to navigate the app.

- `types`
    - Contains a file with all the custom data structures used in the app.
    - These data structures should map to the db structures and contain any frontend-specific data types we need.