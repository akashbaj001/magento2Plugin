import React, { Component, Fragment } from 'react';

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

  handleClickAddSection = () =>
    this.setState(prevState => ({
      sections: [...(prevState.sections || []), { value: '', name: '' }]
    }));

  handleClickRemoveSection = e => {
    e.preventDefault();
    const { target: { id } } = e;
    this.setState(prevState => ({
      sections: [
        ...prevState.sections.slice(0, parseInt(id, 10)),
        ...prevState.sections.slice(parseInt(id, 10) + 1)
      ]
    }));
  };

  handleSectionChange = e => {
    e.preventDefault();
    const { target: { name, id, value } } = e;
    this.setState(prevState => {
      const sections = [...prevState.sections];
      sections[id][name] = value;
      return { sections };
    });
  };

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
            .display-block {
              display: block;
            }
        `
          }}
        />

        <h2>Product Page Layout Configuration</h2>
        <hr />
        <p>
          The sections specified here will appear in the same order on the
          product page. The section heading will be displayed above each
          section. Each custom attribute specified here must contain the text or
          HTML that will be displayed for that section.
        </p>
        {(this.state.sections || []).map((section, id) => (
          <Section
            key={id}
            id={id}
            value={this.state.sections[id].value}
            name={this.state.sections[id].name}
            onChange={this.handleSectionChange}
            onClickRemove={this.handleClickRemoveSection}
          />
        ))}
        <button
          className="margin-bottom btn btn-success"
          onClick={this.handleClickAddSection}
        >
          Add Section
        </button>
        <input className="display-block btn btn-primary" type="submit" />
      </form>
    );
  }
}

const Section = ({ id, value, name, onChange, onClickRemove }) => (
  <Fragment>
    <h5>Section {id + 1}</h5>
    <h6>Section Heading</h6>
    <input
      className="form-control"
      onChange={onChange}
      value={name}
      name="name"
      id={id}
    />
    <h6>Section Custom Attribute Name</h6>
    <input
      className="margin-bottom form-control"
      onChange={onChange}
      value={value}
      name="value"
      id={id}
    />
    <button className="btn btn-danger" onClick={onClickRemove} id={id}>
      Remove Section
    </button>
    <hr />
  </Fragment>
);

export default Form;
