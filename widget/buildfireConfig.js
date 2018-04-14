buildfire.datastore.onUpdate(({ data: { content } }) => {
  window.buildfireConfig = content;
  document.body.style.backgroundImage = `url(${content.backgroundImageURL})`;
}, true);

buildfire.datastore.get('content', (err, res) => {
  document.body.style.backgroundImage = `url(${
    res.data.content.backgroundImageURL
  })`;
  window.buildfireConfig = res.data.content;
  document.body.style.backgroundImage = `url(${
    res.data.content.backgroundImageURL
  })`;

  const bundle = document.createElement('script');
  bundle.setAttribute('src', 'bundle.js');

  document.head.appendChild(bundle);
});
