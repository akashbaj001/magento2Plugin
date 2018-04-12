import React, { Component } from 'react';
import Overlay from './overlay';
import {
  home,
  cart,
  account,
  categories as categoryRoute,
  subcategories
} from '../constants/routes';
import {
  getCategoryDetails,
  getCategories
} from '../services/category-service';
import CategoryList from './component-list';
import { NavLink, Route } from 'react-router-dom';
import '../../css/nav.css';

class Nav extends Component {
  state = {
    isHydrated: false,
    shouldShowOverlay: false
  };

  componentDidMount() {
    const categories = getCategories()
      .then(res => {
        const parsedRes = JSON.parse(res);

        const activeCategories = parsedRes.children_data.filter(
          ({ is_active }) => is_active
        );

        const promises = activeCategories.map(({ id }) =>
          getCategoryDetails(id)
        );

        Promise.all(promises).then(res => {
          const categories = [];
          res.map(unparsedCategory => {
            const category = JSON.parse(unparsedCategory);
            if (category.include_in_menu) {
              categories.push(category);
            }
          });

          this.setState({
            isHydrated: true,
            categories: activeCategories
              .map((category, index) => ({
                ...category,
                categoryDetails: categories[index]
              }))
              .filter(({ categoryDetails }) => categoryDetails != null)
          });
        });
      })
      .catch(err => console.log(err));
  }

  handleClickClose = () => this.setState({ shouldShowOverlay: false });

  handleClickShop = () => this.setState({ shouldShowOverlay: true });

  render() {
    return (
      <nav id="pluginNav" className="Nav">
        {this.state.shouldShowOverlay && (
          <Overlay
            onClickClose={this.handleClickClose}
            isLoading={!this.state.isHydrated}
            render={({ onClickClose }) => (
              <ul key="categoryList" className="Overlay-content">
                {this.state.categories &&
                  this.state.categories.length > 0 && (
                    <CategoryList
                      items={this.state.categories.map(({ id, ...rest }) => ({
                        ...rest,
                        id,
                        uniqueKey: id
                      }))}
                      renderedElement={({ id, name, children_data }) => (
                        <li key={id} className="Overlay-subcategory">
                          <h2>
                            <Route
                              render={({ history }) => (
                                <span
                                  id={id}
                                  onClick={() => {
                                    onClickClose();
                                    history.push(`${subcategories}/${id}`);
                                  }}
                                >
                                  {name}
                                </span>
                              )}
                            />
                          </h2>
                          <section>
                            <ul>
                              <CategoryList
                                items={children_data.map(({ id, ...rest }) => ({
                                  ...rest,
                                  id,
                                  uniqueKey: id
                                }))}
                                renderedElement={({ id, name }) => (
                                  <li key={id} className="Overlay-subcategory">
                                    <Route
                                      render={({ history }) => (
                                        <span
                                          id={id}
                                          className="text-primary"
                                          onClick={() => {
                                            onClickClose();
                                            history.push(
                                              `${categoryRoute}/${id}`
                                            );
                                          }}
                                        >
                                          {name}
                                        </span>
                                      )}
                                    />
                                  </li>
                                )}
                                showNoItemsMessage={false}
                              />
                            </ul>
                          </section>
                        </li>
                      )}
                      showNoItemsMessage={false}
                    />
                  )}
              </ul>
            )}
          />
        )}
        <ul className="Nav-list">
          <li className="Nav-list-item">
            <NavLink to={home}>Home</NavLink>
          </li>
          <li className="Nav-list-item" onClick={this.handleClickShop}>
            Shop
          </li>
          <li className="Nav-list-item">
            <NavLink to={cart}>Cart</NavLink>
          </li>
          <li className="Nav-list-item">
            <NavLink to={account}>Account</NavLink>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
