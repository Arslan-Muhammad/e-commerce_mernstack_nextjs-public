
import Navbar from '@/components/navbar'
import { store, wrapper } from '@/store/store';
import '@/styles/globals.css'
import { Provider } from 'react-redux';
import { initFlowbite } from 'flowbite'
import { useEffect } from 'react';
import Footer from '@/components/footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAutoLogin from '@/hooks/useAutoLogin';

function App({ Component, pageProps }) {

  const loading = useAutoLogin();

  useEffect(() => {
    initFlowbite();
  })
  return loading ? "" : (
    <Provider store={store}>
      <Navbar />
      <ToastContainer />
      <Component {...pageProps} />
      <Footer />
    </Provider>
  )
}

export default wrapper.withRedux(App);