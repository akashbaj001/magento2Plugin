import React, { Component, Fragment } from 'react';

class Form extends Component {
  componentDidMount() {
    buildfire.datastore.get('content', (err, res) =>
      this.setState(
        {
          ...res.data.content,
          isHydrated: true
        },
        () => {
          const background = new buildfire.components.images.thumbnail(
            document.getElementById('BackgroundImage'),
            {
              title: ' ',
              dimensionsLabel: ' '
            }
          );

          if (res.data.content.backgroundImageURL) {
            background.loadbackground(res.data.content.backgroundImageURL);
          }

          background.onChange = newUrl =>
            buildfire.datastore.get('content', (err, res) =>
              buildfire.datastore.save(
                {
                  content: {
                    ...res.data.content,
                    backgroundImageURL: newUrl
                  }
                },
                'content'
              )
            );

          background.onDelete = url =>
            buildfire.datastore.get('content', (err, res) =>
              buildfire.datastore.save(
                {
                  content: {
                    ...res.data.content,
                    backgroundImageURL: ''
                  }
                },
                'content'
              )
            );

          const logo = new buildfire.components.images.thumbnail(
            document.getElementById('LogoImage'),
            {
              title: ' ',
              dimensionsLabel: ' '
            }
          );

          if (res.data.content.logoImageURL) {
            logo.loadbackground(res.data.content.logoImageURL);
          }

          logo.onChange = newUrl =>
            buildfire.datastore.get('content', (err, res) =>
              buildfire.datastore.save(
                {
                  content: {
                    ...res.data.content,
                    logoImageURL: newUrl
                  }
                },
                'content'
              )
            );

          logo.onDelete = url =>
            buildfire.datastore.get('content', (err, res) =>
              buildfire.datastore.save(
                {
                  content: {
                    ...res.data.content,
                    logoImageURL: ''
                  }
                },
                'content'
              )
            );

          const banner = new buildfire.components.images.thumbnail(
            document.getElementById('BannerImage'),
            {
              title: ' ',
              dimensionsLabel: '18:9 Aspect Ratio'
            }
          );

          if (res.data.content.bannerImageUrl) {
            banner.loadbackground(res.data.content.bannerImageUrl);
          }

          banner.onChange = newUrl =>
            buildfire.datastore.get('content', (err, res) =>
              buildfire.datastore.save(
                {
                  content: {
                    ...res.data.content,
                    bannerImageUrl: newUrl
                  }
                },
                'content'
              )
            );

          banner.onDelete = url =>
            buildfire.datastore.get('content', (err, res) =>
              buildfire.datastore.save(
                {
                  content: {
                    ...res.data.content,
                    bannerImageUrl: ''
                  }
                },
                'content'
              )
            );
        }
      )
    );
  }

  state = {
    isHydrated: false
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
        `
          }}
        />

        <h3>Background Image</h3>
        <p>Displayed behind the content on every page.</p>
        <div id="BackgroundImage" />

        <h3>Logo Image</h3>
        <p>Displayed in the header.</p>
        <div id="LogoImage" />

        <h3>Ad Banner Image</h3>
        <p>Displayed on the home page above the list of categories.</p>
        <div id="BannerImage" />
      </form>
    );
  }
}

export default Form;
