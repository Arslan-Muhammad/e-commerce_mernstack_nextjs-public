import '@/styles/globals.css'
import Navbar from "../components/Navbar";
import { initFlowbite } from 'flowbite'
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, wrapper } from '@/store/store';
import { Provider } from 'react-redux';
import useAutoLogin from '@/hook/useAutoLogin';
import Loading from '@/components/Loading';
import { useRouter } from 'next/router';

function App({ Component, pageProps }) {

  useEffect(() => {
    initFlowbite();
  });

  const loading = useAutoLogin();
  const router = useRouter();

  const showNavbar = (router.pathname === '/' || router.pathname === '/forgetPassword' ||  router.pathname === '/resetPassword') ? false : true;

  return loading ? <Loading /> : (
    <>
      <Provider store={store} >
        {showNavbar && <Navbar />}
        <ToastContainer autoClose={3000} />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default wrapper.withRedux(App);