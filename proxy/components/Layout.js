import React from 'react';

export default class Layout extends React.Component {
  state = {
    title: "Welcome to React SSR!"
  }

  render() {
    const { title } = this.state;
    return (
      <div
        onClick={() => alert()}
      >
        <h1>{title}</h1>
      </div>
    )
  }
}