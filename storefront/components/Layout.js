import React from 'react';
import '../style/client.scss';

class Layout extends React.Component {
  state = {
    title: "Storefront Script"
  }
  
  render() {
    const { title } = this.state;
    return (
      <div
        id="app"
        className="page-width"
      >
        <h1>{title}</h1>
        <button onClick={() => console.log('storefront script works')}>click</button>
      </div>
    )
  }
}

export default Layout;