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
        />

        <h2>Custom Attribute Configuration</h2>
        <hr />
        <p>
          These settings control which custom attributes are used to display
          images and descriptions for categories.
        </p>
        <h3>Category Image Custom Attribute Name</h3>
        <p>
          If a category is top-level, the image file specified in this custom
          attribute is displayed as the banner for the category on the homepage
          and on its subcategory listing page. This image file must be under
          Magento's /pub/media/catalog/category/ directory on your domain.
        </p>
        <input
          className="form-control"
          onChange={this.handleChange}
          value={this.state.categoryImageAtName}
          name="categoryImageAtName"
        />

        <h3>Category Thumbnail Custom Attribute Name</h3>
        <p>
          If a category is not top-level, the image file specified in this
          custom attribute is displayed as its square image on the subcategory
          listing pages where it appears. This image file must be under
          Magento's /pub/media/catalog/category/ directory on your domain.
        </p>
        <input
          className="form-control"
          onChange={this.handleChange}
          value={this.state.categoryThumbnailAtName}
          name="categoryThumbnailAtName"
        />
        <h3>Product Image Custom Attribute Name</h3>
        <p>
          This is the product thumbnail that is displayed on product listing
          pages and in the cart. This image file must be under Magento's
          /pub/media/catalog/product/ directory on your domain. The file names
          specified as the value under this custom attribute must each begin
          with a /.
        </p>
        <input
          className="form-control"
          onChange={this.handleChange}
          value={this.state.productImageAtName}
          name="productImageAtName"
        />
        <h3>Short Product Description Custom Attribute Name</h3>
        <p>
          This is the short description that is displayed for a product on
          product listing pages.
        </p>
        <input
          className="form-control"
          onChange={this.handleChange}
          value={this.state.shortCategoryDescriptionAtName}
          name="shortCategoryDescriptionAtName"
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
