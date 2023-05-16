import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import Header from './Component/header';
import Home from './Pages/home';
import DetailsPage from './Pages/detailsPage';
import Login from './Component/login';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
import { Suspense, useState, useTransition } from 'react';
// import ArtistPage from './ArtistPage.js';
// import Layout from './Layout.js';

export default function App() {
  return (
    <Suspense fallback={<BigSpinner />}>
      <Router />
    </Suspense>
  );
}

function Router() {
  const [page, setPage] = useState('/');
  const [isPending, startTransition] = useTransition();
  const [modalShow, setModalShow] = React.useState(false);

  function navigate(url:string) {
    startTransition(() => {
      setPage(url);
    });
  }
  
  // TODO: update router
  console.log('#K_ page: ', page)
  let content;
  if (page === '/') {
    content = (
      <Home navigate={navigate}/>
    );
  } else if (page === '/Election1') {
    content = (
      <DetailsPage navigate={navigate}/>
    );
  }
  return (
    <Header isPending={isPending} navigate={navigate}>
      {content}
    </Header>
  );
}

function BigSpinner() {
  return <h2>🌀 Loading...</h2>;
}


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);