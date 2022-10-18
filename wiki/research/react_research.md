# React research

[React](https://reactjs.org/) is a library for javascript which is designed to make rendering the front end a breeze.

[Here's a basic tutorial](https://reactjs.org/tutorial/tutorial.html). By the end of this, you will have your own tic-tac-toe game.

[Here's a sort of cheatsheet](https://www.freecodecamp.org/news/the-react-cheatsheet/) which offers the same information in a more list-like format rather than a first-timer's tutorial.

There's an additional library which adds on to the react library, called [React Native](https://reactnative.dev/). 
It also has a [tutorial](https://reactnative.dev/docs/getting-started), though there's not a finished product like with the other one. 
If you decide to read the tutorial, be warned: it's somewhat long with many pages worth of content. Though the content is very helpful, such as [how to set up your environment](https://reactnative.dev/docs/environment-setup).

Information that brings together some previous ideas, like React Native, to build forms with validation: https://react-hook-form.com/get-started/

Formik and other react libraries for form validation should be interesting: https://www.kindacode.com/article/top-react-form-validation-libraries/

## Libraries we should use

- React Query
    - this is a useful wrapper for managing the data we get from Remix and any API calls we make. You wrap your request (or hook) and you can pull out useful state variables such as the data, isLoading, isSuccess, etc.
    - It's also a really good tool for state management. You can use it to cache very data heavy request responses (for instance our product catalog). It makes things really easy to develop compared to trying to manage React's state yourself
- React testing library / jest
    - Used to write front-end unit tests. As testing libraries go, it's not terrible, but it is kinda fiddly. Still useful when designing complicated from ends.