import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchList from './components/SearchList';
import DetailView from './components/DetailView';
import { SearchProvider } from './context/SearchContext';

function App() {
  return (
    <SearchProvider>
      <div className="container">
        <Routes>
          <Route path="/" element={<SearchList />} />
          <Route path="/detail/:id" element={<DetailView />} />
        </Routes>
      </div>
    </SearchProvider>
  );
}

export default App;
