import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

import store from '../redux/store';

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp;