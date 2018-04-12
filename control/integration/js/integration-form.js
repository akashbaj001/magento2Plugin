import React, { Component } from 'react';

class Form extends Component {
  componentDidMount() {
    buildfire.datastore.get('content', (err, res) =>
      this.setState({
        ...res.data.content,
        isHydrated: true
      })
    );
  }

  state = {
    isHydrated: false
  };

  handleClickSubmit = e => {
    e.preventDefault();
    const { isHydrated, ...payload } = this.state;
    buildfire.datastore.save(
      {
        content: {
          ...payload
        }
      },
      'content'
    );
  };

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value });

  render() {
    return !this.state.isHydrated ? null : (
      <form onSubmit={this.handleClickSubmit}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          input {
            width: 75%;
            display: block;
          }
          .margin-bottom {
            margin-bottom: 10px;
          }
        `
          }}
        />

        <h2>Integration Token</h2>
        <hr />
        <p>
          This integration token is required in order to load certain
          information for your store. You must generate an integration token
          under your Magento admin dashboard by navigating to System >
          Integrations and pressing "Add New Integration." Fill out the form and
          press "Save," and paste the token it provides you with into this box.
        </p>
        <input
          className="margin-bottom form-control"
          onChange={this.handleChange}
          value={this.state.integrationToken}
          name="integrationToken"
        />

        <input className="btn btn-primary" type="submit" />
      </form>
    );
  }
}

export default Form;
