
import Navbar from '@/components/navbar'
import { store } from '@/store/store'
import '@/styles/globals.css'
import { Provider } from 'react-redux';
import { initFlowbite } from 'flowbite'
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {

  useEffect(() => {
    initFlowbite();
})
  return (
    <Provider store={store}>
      <Navbar />
      <Component {...pageProps} />
    </Provider>
  )
}
