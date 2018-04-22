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
          className="form-control margin-bottom"
          onChange={this.handleChange}
          value={this.state.shortCategoryDescriptionAtName}
          name="shortCategoryDescriptionAtName"
        />
        <input className="display-block btn btn-primary" type="submit" />
      </form>
    );
  }
}

export default Form;
