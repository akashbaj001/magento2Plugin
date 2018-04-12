import React from 'react';
import { render } from 'react-dom';
import Form from './integration-form';

const App = () => <Form />;

render(<App />, document.getElementById('content'));
