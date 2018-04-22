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
          .form-control {
            width: 75%;
            display: block;
          }
          .margin-bottom {
            margin-bottom: 10px;
          }
          .display-block {
            display: block;
          }
        `
          }}
        />

        <h2>Site Settings</h2>
        <hr />
        <h3>Domain</h3>
        <p>This is the root domain of your application's Magento server.</p>
        <input
          className="form-control"
          onChange={this.handleChange}
          value={this.state.domain}
          name="domain"
          placeholder="https://yourwebsite.com"
          required
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
          required
        />
        <input className="display-block btn btn-primary" type="submit" />
      </form>
    );
  }
}

export default Form;
