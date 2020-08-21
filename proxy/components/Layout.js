import React from 'react';
import { hydrate } from "react-dom";


export default class Layout extends React.Component {
  state = {
    title: "Welcome to React SSR! 2"
  }

  render() {
    const { title } = this.state;
    return (
      <div
        className="page-width"
        onClick={() => alert()}
      >
        <h1>{title}</h1>
      </div>
    )
  }
}