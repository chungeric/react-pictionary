# React Pictionary App

This is my attempt at creating a real-time multiplayer pictionary game using React and Redux.

**Live demo: <https://scribbz.herokuapp.com/>**

## Other tools used

- socket.io
- express.js server

## Getting Started

```
> git clone https://github.com/chungeric/react-pictionary.git
> cd react-pictionary
> npm install
> npm start
```

## Deploying to Heroku

```
> npm run build (add bundle.js to project)
> git add .
> git commit -m '<message>'
> git push heroku master
```

## WIP

Currently trying to figure out canvas image scaling.
Also need to figure out how to make canvas area the same on all computer screens.

**Ideas:**

- Add **user turns** functionality so that I can collect every drawing point the user makes in Redux state, share with all sockets, and redraw a scaled version on the resized canvas when the window is resized by anyone
