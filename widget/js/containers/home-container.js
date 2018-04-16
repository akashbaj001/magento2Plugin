import React, { Component } from 'react';
import Home from '../components/home';
import {
  getCategories,
  getCategoryDetails
} from '../services/category-service';
import Spinner from 'react-spinkit';

class HomeContainer extends Component {
  state = {
    isHydrated: false,
    adBannerImageUrl: null
  };

  componentWillMount() {
    buildfire.datastore.onUpdate(({ data: { content } }) => {
      this.setState({ adBannerImageUrl: content.bannerImageUrl || null });
    }, true);
    window.buildfire.notifications.localNotification.checkPermission(
      (err, data) =>
        data
          ? {}
          : window.buildfire.notifications.localNotification.requestPermission()
    );
  }

  componentDidMount() {
    const data = JSON.parse(sessionStorage.getItem('home'));
    data
      ? this.setState(data)
      : buildfire.datastore.get('content', (err, dataStoreRes) =>
          getCategories()
            .then(res => {
              const activeCategories = JSON.parse(res).children_data.filter(
                ({ is_active }) => is_active
              );

              Promise.all(
                activeCategories.map(({ id }) => getCategoryDetails(id))
              ).then(res => {
                const categories = [];
                res.map(unparsedCategory => {
                  const category = JSON.parse(unparsedCategory);
                  if (category.include_in_menu) {
                    categories.push(category);
                  }
                });

                const loadData = {
                  isHydrated: true,
                  adBannerImageUrl:
                    dataStoreRes.data.content.bannerImageUrl || null,
                  categories: activeCategories
                    .map((category, index) => ({
                      ...category,
                      categoryDetails: categories[index]
                    }))
                    .filter(({ categoryDetails }) => categoryDetails != null)
                };
                sessionStorage.setItem('home', JSON.stringify(loadData));
                this.setState(loadData);
              });
            })
            .catch(err => console.log(err))
        );
  }

  render() {
    return this.state.isHydrated ? (
      <Home
        categories={this.state.categories}
        adBannerImageUrl={this.state.adBannerImageUrl}
        categoryImageAtName={window.buildfireConfig.categoryImageAtName}
      />
    ) : (
      <Spinner color="gray" />
    );
  }
}

export default HomeContainer;
