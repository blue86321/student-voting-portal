import React from 'react';

import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import Header from './Component/header';
import Home from './Pages/home';
import DetailsPage from './Pages/detailsPage';
import CreateElectionPage from './Pages/createElectionPage';
import ManageUsers from './Pages/manageUsers';
import Login from './Component/login';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense, useState, useTransition } from 'react';
import ResultPage from './Pages/resultPage';
import CreateNewElection from './Pages/createElectionPage';


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
  } else if (page === '/create_new_elections') {
    content = (
      <CreateElectionPage navigate={navigate}/>
    );
  } else if (page === '/manage_users') {
    content = (
      <ManageUsers navigate={navigate}/>
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