import React, { PropTypes } from 'react';

export class Content extends React.Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div className='col-md-8'>
        Content
      </div>
    );
  }
}
