import '@/styles/globals.css'
import Navbar from "../components/Navbar";
import Login from '@/components/Login';
import { initFlowbite } from 'flowbite'
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store, wrapper } from '@/store/store';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import useAutoLogin from '@/hook/useAutoLogin';
import Loading from '@/components/Loading';

function App({ Component, pageProps }) {

  useEffect(() => {
    initFlowbite();
  });

  const loading = useAutoLogin();
  const isLoggedIn = useSelector(state => state.auth.user.auth);


  return loading ? <Loading /> : isLoggedIn ? (
    <>
      <Provider store={store} >      <Navbar />
        <ToastContainer autoClose={3000} />
        <Component {...pageProps} />
      </Provider>
    </>
  ) : (
    <>
      <Provider store={store} >
        <Login />
        <ToastContainer autoClose={3000} />
      </Provider>
    </>

  );
}

export default  wrapper.withRedux(App);