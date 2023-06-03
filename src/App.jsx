import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_KEY;
const BASE = 'https://api.themoviedb.org/3';
const IMG = 'https://image.tmdb.org/t/p/w300';

function MovieCard({ movie, onClick }) {
  return (
    <div onClick={() => onClick(movie)} style={{ cursor:'pointer', background:'#1c1c2e', borderRadius:12, overflow:'hidden', transition:'transform 0.2s' }}
      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
      {movie.poster_path
        ? <img src={`${IMG}${movie.poster_path}`} alt={movie.title} style={{ width:'100%', display:'block' }}/>
        : <div style={{ height:200, background:'#2d2d44', display:'flex', alignItems:'center', justifyContent:'center', color:'#555' }}>No Poster</div>}
      <div style={{ padding:12 }}>
        <p style={{ color:'white', fontWeight:600, margin:'0 0 4px', fontSize:14 }}>{movie.title}</p>
        <p style={{ color:'#f59e0b', margin:0, fontSize:13 }}>⭐ {movie.vote_average?.toFixed(1)}</p>
      </div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${BASE}/trending/movie/week?api_key=${API_KEY}`)
      .then(r => setTrending(r.data.results.slice(0,8)));
  }, []);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    const r = await axios.get(`${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    setMovies(r.data.results);
    setLoading(false);
    setSelected(null);
  };

  const display = movies.length > 0 ? movies : trending;

  return (
    <div style={{ minHeight:'100vh', background:'#0a0a1a', fontFamily:'sans-serif', padding:'32px 24px' }}>
      <h1 style={{ color:'#e50914', textAlign:'center', marginBottom:24 }}>🎬 Movie Search</h1>
      <div style={{ display:'flex', gap:8, maxWidth:500, margin:'0 auto 32px' }}>
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()}
          placeholder="Search movies..." style={{ flex:1, padding:'12px 16px', borderRadius:8, border:'none', fontSize:16, background:'#1c1c2e', color:'white' }}/>
        <button onClick={search} style={{ padding:'12px 24px', borderRadius:8, background:'#e50914', color:'white', border:'none', cursor:'pointer', fontSize:16 }}>
          {loading?'...':'Search'}
        </button>
      </div>
      {selected ? (
        <div style={{ maxWidth:600, margin:'0 auto', background:'#1c1c2e', borderRadius:16, padding:24, color:'white' }}>
          <button onClick={()=>setSelected(null)} style={{ background:'none', border:'1px solid #444', color:'white', padding:'8px 16px', borderRadius:8, cursor:'pointer', marginBottom:16 }}>← Back</button>
          <div style={{ display:'flex', gap:20 }}>
            {selected.poster_path && <img src={`${IMG}${selected.poster_path}`} style={{ width:140, borderRadius:8 }}/>}
            <div>
              <h2 style={{ margin:'0 0 8px' }}>{selected.title}</h2>
              <p style={{ color:'#f59e0b' }}>⭐ {selected.vote_average?.toFixed(1)} / 10</p>
              <p style={{ color:'#888', fontSize:13 }}>{selected.release_date}</p>
              <p style={{ color:'#ccc', lineHeight:1.6 }}>{selected.overview}</p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h3 style={{ color:'#888', textAlign:'center' }}>{movies.length > 0 ? 'Search Results' : 'Trending This Week'}</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:16, maxWidth:1000, margin:'0 auto' }}>
            {display.map(m => <MovieCard key={m.id} movie={m} onClick={setSelected}/>)}
          </div>
        </div>
      )}
    </div>
  );
}
