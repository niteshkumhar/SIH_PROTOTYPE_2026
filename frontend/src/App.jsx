import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet/dist/leaflet.css';
import area from '@turf/area';

const API_BASE_URL = 'https://terrabyte-api-q9xv.onrender.com';

const { Overlay, BaseLayer } = LayersControl;

// ==========================================
// THEME CONTROL BUTTON COMPONENT
// ==========================================
function ThemeToggle({ isDarkMode, setIsDarkMode }) {
  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800'
          : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-100 shadow-sm'
      }`}
      title="Toggle Light/Dark Theme"
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}

// ==========================================
// 1. LANDING PAGE
// ==========================================
function LandingPage({ isDarkMode, setIsDarkMode }) {
  const bgClass = isDarkMode ? 'bg-[#07090E] text-slate-100' : 'bg-slate-50 text-slate-900';
  const navBg = isDarkMode ? 'bg-[#0B0F17]/90 border-slate-800/80' : 'bg-white/90 border-slate-200 shadow-sm';
  const cardBg = isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200 shadow-md';

  return (
    <div className={`min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-black font-sans transition-colors duration-200 ${bgClass}`}>
      {/* Navbar */}
      <nav className={`flex items-center justify-between px-8 py-4 border-b backdrop-blur-md sticky top-0 z-50 ${navBg}`}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            TB
          </div>
          <div>
            <span className={`text-lg font-bold tracking-tight block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              TerraByte <span className="text-emerald-500 font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Cadastral AI</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block -mt-0.5">Automated Land Survey Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Link to="/login" className={`text-xs font-semibold uppercase tracking-wider transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            Sign In
          </Link>
          <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-emerald-500/25 active:scale-95">
            Launch GIS Engine →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 text-center flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold mb-6">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          AI-Powered Deep Learning Spatial Engine
        </div>

        <h1 className={`text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Automated Cadastral Boundary <br />
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
            Extraction & Land Vectorization
          </span>
        </h1>

        <p className={`text-base md:text-lg max-w-3xl mb-10 leading-relaxed font-normal ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          High-precision spatial boundary extraction from aerial drone imagery and GeoTIFF satellite rasters. Convert unstructured land imagery into editable GIS vectors instantly.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-16">
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
            Open Map Workstation
          </Link>
          <Link to="/admin" className={`w-full sm:w-auto px-8 py-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200' : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'}`}>
            Spatial Records DB
          </Link>
        </div>

        {/* System Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${cardBg}`}>
            <div className="text-xs font-mono text-emerald-500 mb-1">01 / DETECTION</div>
            <h3 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Automated Boundary Segmentor</h3>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Runs computer vision pipelines to outline cadastral boundaries and remove micro-vertex jitter.</p>
          </div>
          <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${cardBg}`}>
            <div className="text-xs font-mono text-emerald-500 mb-1">02 / INTERACTION</div>
            <h3 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Web-GIS CAD Suite</h3>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Integrated Geoman CAD tools for live boundary reshaping, vertex splitting, and parcel creation.</p>
          </div>
          <div className={`p-6 rounded-2xl border backdrop-blur-sm transition-all ${cardBg}`}>
            <div className="text-xs font-mono text-emerald-500 mb-1">03 / EXPORT</div>
            <h3 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Multi-Format Spatial Persistence</h3>
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Seamless spatial synchronization with FastAPI backend supporting GeoJSON, KML, and Shapefiles.</p>
          </div>
        </div>
      </main>

      <footer className={`border-t py-4 text-center text-xs font-mono ${isDarkMode ? 'border-slate-800/60 text-slate-500' : 'border-slate-200 text-slate-500'}`}>
        TerraByte Cadastral Engine
      </footer>
    </div>
  );
}

// ==========================================
// 2. AUTHENTICATION PAGE
// ==========================================
function LoginPage({ isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();
  const [role, setRole] = useState('surveyor');

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const bgClass = isDarkMode ? 'bg-[#07090E] text-slate-100' : 'bg-slate-100 text-slate-900';
  const cardBg = isDarkMode ? 'bg-[#0B0F17] border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-xl';
  const inputBg = isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 font-sans relative ${bgClass}`}>
      <div className="absolute top-6 right-6">
        <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </div>

      <div className={`w-full max-w-md p-8 rounded-3xl border ${cardBg}`}>
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 text-2xl mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            TB
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GIS Portal Access</h2>
          <p className="text-xs text-slate-400 mt-1">Authenticate to enter the Cadastral Workstation</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Role Profile</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${inputBg}`}>
              <option value="surveyor">Field Surveyor</option>
              <option value="admin">GIS System Administrator</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Surveyor Identifier</label>
            <input type="email" required defaultValue="surveyor@terrabyte.ai" className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${inputBg}`} />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Passcode</label>
            <input type="password" required defaultValue="••••••••" className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none focus:border-emerald-500 ${inputBg}`} />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
            Enter GIS Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. ADMIN PANEL
// ==========================================
function AdminPanel({ geoData, isDarkMode, setIsDarkMode }) {
  const bgClass = isDarkMode ? 'bg-[#07090E] text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = isDarkMode ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-slate-200 shadow-sm';

  return (
    <div className={`min-h-screen p-8 font-sans transition-colors duration-200 ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/60">
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Spatial Records Management</h1>
            <p className="text-xs text-slate-400 mt-1">Review active extracted polygons and backend database records</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <Link to="/dashboard" className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-emerald-400 hover:bg-slate-800' : 'bg-white border-slate-300 text-emerald-600 hover:bg-slate-100 shadow-sm'}`}>
              ← Return to GIS Engine
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Active Parcels</span>
            <p className="text-4xl font-extrabold text-emerald-500 font-mono">{geoData?.features?.length || 0}</p>
          </div>
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Spatial Projection</span>
            <p className="text-4xl font-extrabold text-teal-500 font-mono">EPSG:4326</p>
          </div>
          <div className={`p-6 rounded-2xl border ${cardBg}`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">FastAPI Backend Status</span>
            <p className="text-4xl font-extrabold text-emerald-500 font-mono">Active</p>
          </div>
        </div>

        <div className={`border rounded-2xl overflow-hidden ${cardBg}`}>
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Extracted Cadastral Database</h3>
            <span className="text-xs font-mono text-slate-400">{geoData?.features?.length || 0} Records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className={`${isDarkMode ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'} uppercase text-[10px] tracking-wider border-b`}>
                <tr>
                  <th className="px-6 py-3">Parcel ID</th>
                  <th className="px-6 py-3">Source Engine</th>
                  <th className="px-6 py-3">Geometry Type</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                {geoData?.features?.map((f, i) => (
                  <tr key={i} className={isDarkMode ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'}>
                    <td className="px-6 py-4 text-emerald-500 font-bold">{f.properties?.id || `cadastral_parcel_${i}`}</td>
                    <td className="px-6 py-4">{f.properties?.source || 'AI Segmentor'}</td>
                    <td className="px-6 py-4 text-slate-400">{f.geometry?.type}</td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 text-[10px] font-bold uppercase tracking-wider transition-all">Delete Record</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAP WORKSTATION CONTROLLERS & HOVER INTERACTION
// ==========================================
function MapController({ geoData }) {
  const map = useMap();
  useEffect(() => {
    if (geoData?.features?.length > 0) {
      try {
        const geoJsonLayer = L.geoJSON(geoData);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 19 });
        }
      } catch (err) {
        console.error("Bounds error:", err);
      }
    }
  }, [geoData, map]);
  return null;
}

function GeomanControls({ setSyncStatus, fetchParcels }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    setTimeout(() => map.invalidateSize(), 200);

    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawCircleMarker: false,
      drawPolyline: false,
      drawRectangle: true,
      drawPolygon: true,
      drawCircle: false,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true,
    });

    map.pm.setGlobalOptions({ snappingOption: true, allowSelfIntersection: true });

    const saveParcelToBackend = async (geoJsonData, message) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/parcels/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geoJsonData),
        });
        if (res.ok) {
          setSyncStatus(message);
          if (fetchParcels) await fetchParcels();
          setTimeout(() => setSyncStatus(''), 2500);
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    };

    map.on('pm:create', (e) => {
      const newGeoJSON = e.layer.toGeoJSON();
      newGeoJSON.properties = { id: `cadastral_manual_${Date.now()}`, source: 'Surveyor_Manual_Edit' };
      saveParcelToBackend(newGeoJSON, 'Parcel created!');
    });

    map.on('pm:globaleditmodetoggled', (e) => {
      if (!e.enabled) {
        map.eachLayer((layer) => {
          if (layer.pm && layer.toGeoJSON && layer.feature) {
            const updatedGeoJSON = layer.toGeoJSON();
            if (updatedGeoJSON.properties?.id) {
              saveParcelToBackend(updatedGeoJSON, 'Edits saved!');
            }
          }
        });
      }
    });

    return () => map.pm.removeControls();
  }, [map, fetchParcels, setSyncStatus]);

  return null;
}

// Interactive GeoJSON Layer with Dynamic Area & Ward Tooltip
function InteractiveGeoJSON({ geoData, setHoveredParcel, mapKey }) {
  const onEachFeature = (feature, layer) => {
    layer.on({
      mousemove: (e) => {
        // Get current layer geometry (handles edited/reshaped shapes dynamically)
        const currentGeoJSON = layer.toGeoJSON();
        
        // Calculate area in square meters using Turf.js
        const calculatedArea = area(currentGeoJSON);
        const formattedArea = calculatedArea.toLocaleString('en-US', {
          maximumFractionDigits: 0,
        }) + ' sq.m';

        setHoveredParcel({
          id: feature.properties?.id || 'Parcel Boundary',
          ward: feature.properties?.ward || 'Ward 112 - Central Zone',
          area: formattedArea, // Dynamic calculation!
          source: feature.properties?.source || 'AI Detection Model',
          lat: e.latlng.lat.toFixed(6),
          lng: e.latlng.lng.toFixed(6),
          x: e.originalEvent.clientX,
          y: e.originalEvent.clientY,
        });
      },
      mouseout: () => setHoveredParcel(null),
    });
  };

  return (
    <GeoJSON
      key={mapKey}
      data={geoData}
      style={{ color: '#10B981', weight: 2.5, fillOpacity: 0.25 }}
      onEachFeature={onEachFeature}
    />
  );
}

// ==========================================
// 5. MAIN ENTERPRISE DASHBOARD
// ==========================================
function Dashboard({ geoData, mapKey, fetchParcels, isDarkMode, setIsDarkMode }) {
  const [syncStatus, setSyncStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [hoveredParcel, setHoveredParcel] = useState(null);
  const [threshold, setThreshold] = useState(85);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setSyncStatus('Executing AI Inference...');

    const formData = new FormData();
    formData.append('file', file);

    fetch(`${API_BASE_URL}/api/v1/process-drone-image`, {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setUploading(false);
        setSyncStatus(`Extracted ${data.parcels_detected || 0} Parcels!`);
        fetchParcels();
        setTimeout(() => setSyncStatus(''), 4000);
      })
      .catch((err) => {
        setUploading(false);
        setSyncStatus('Inference failed.');
        console.error(err);
      });
  };

  const handleExport = (type) => {
    if (!geoData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geoData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cadastral_export_${Date.now()}.${type === 'geojson' ? 'geojson' : 'json'}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const bgClass = isDarkMode ? 'bg-[#07090E] text-slate-100' : 'bg-slate-100 text-slate-900';
  const headerBg = isDarkMode ? 'bg-[#0B0F17] border-slate-800/80' : 'bg-white border-slate-200 shadow-sm';
  const sidebarBg = isDarkMode ? 'bg-[#0B0F17] border-slate-800/80' : 'bg-white border-slate-200 shadow-lg';
  const subCardBg = isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200';

  const tileUrl = isDarkMode
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className={`w-screen h-screen flex flex-col overflow-hidden font-sans transition-colors duration-200 ${bgClass}`}>
      
      {/* TOP WORKSTATION HEADER */}
      <header className={`h-14 border-b px-6 flex items-center justify-between z-30 shrink-0 ${headerBg}`}>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">TB</div>
            <span className={`font-bold text-sm tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              TerraByte <span className="text-emerald-500 font-mono text-[10px] uppercase">GIS Engine</span>
            </span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-700/50"></div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SYSTEM ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>EPSG:4326</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {syncStatus && (
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono">
              {syncStatus}
            </div>
          )}
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
          <Link to="/admin" className="text-xs text-slate-400 hover:text-emerald-500 transition-colors uppercase font-mono">
            Spatial DB
          </Link>
          <Link to="/" className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'}`}>
            Exit Engine
          </Link>
        </div>
      </header>

      {/* WORKSTATION BODY */}
      <div className="flex-1 flex relative overflow-hidden">
        
        {/* LEFT CONTROL SIDEBAR */}
        <aside className={`w-80 border-r flex flex-col z-20 shrink-0 ${sidebarBg}`}>
          
          {/* Sidebar Tabs */}
          <div className="flex border-b border-slate-700/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <button 
              onClick={() => setActiveTab('upload')} 
              className={`flex-1 py-3 border-b-2 transition-all ${activeTab === 'upload' ? 'border-emerald-500 text-emerald-500 font-extrabold' : 'border-transparent hover:text-slate-200'}`}>
              Inference
            </button>
            <button 
              onClick={() => setActiveTab('layers')} 
              className={`flex-1 py-3 border-b-2 transition-all ${activeTab === 'layers' ? 'border-emerald-500 text-emerald-500 font-extrabold' : 'border-transparent hover:text-slate-200'}`}>
              Parcels ({geoData?.features?.length || 0})
            </button>
            <button 
              onClick={() => setActiveTab('export')} 
              className={`flex-1 py-3 border-b-2 transition-all ${activeTab === 'export' ? 'border-emerald-500 text-emerald-500 font-extrabold' : 'border-transparent hover:text-slate-200'}`}>
              Export
            </button>
          </div>

          {/* Sidebar Content Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* TAB 1: INFERENCE & UPLOAD */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>GeoTIFF Imagery Upload</h4>
                  <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">Upload drone orthomosaics or satellite GeoTIFF files to trigger automatic boundary extraction.</p>
                  
                  <label className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group ${subCardBg} hover:border-emerald-500/50`}>
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold mb-3 transition-all">
                      ↑
                    </div>
                    <span className={`text-xs font-bold group-hover:text-emerald-500 transition-colors ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {uploading ? 'Processing Spatial Model...' : 'Select GeoTIFF File'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">Supports .tif, .tiff, .png</span>
                    <input type="file" accept="image/*,.tif,.tiff" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="border-t border-slate-700/50 pt-5">
                  <div className="flex justify-between items-center mb-2">
                    <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Confidence Threshold</label>
                    <span className="text-xs font-mono text-emerald-500 font-bold">{threshold}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="99" 
                    value={threshold} 
                    onChange={(e) => setThreshold(e.target.value)} 
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">Adjust confidence score to filter lower probability boundary predictions.</p>
                </div>
              </div>
            )}

            {/* TAB 2: PARCEL LIST & ATTRIBUTES */}
            {activeTab === 'layers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Detected Cadastral Parcels</h4>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20">{geoData?.features?.length || 0} items</span>
                </div>

                <div className="space-y-2">
                  {geoData?.features?.map((f, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedParcel(f)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedParcel === f 
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' 
                          : isDarkMode 
                            ? 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-center font-mono font-bold text-emerald-500 mb-1">
                        <span>{f.properties?.id || `parcel_${i}`}</span>
                        <span className="text-[10px] text-slate-400">{f.geometry?.type}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex justify-between">
                        <span>Source: {f.properties?.source || 'AI Detection'}</span>
                        <span>Vertices: {f.geometry?.coordinates[0]?.length || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: EXPORTS */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Export Spatial Geometries</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">Download current vectorized boundaries for integration with ArcGIS, QGIS, or AutoCAD.</p>

                <div className="space-y-3 pt-2">
                  <button onClick={() => handleExport('geojson')} className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-bold flex justify-between items-center transition-all ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200' : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800'}`}>
                    <span>Standard GeoJSON (.geojson)</span>
                    <span className="text-emerald-500">↓</span>
                  </button>
                  <button onClick={() => handleExport('kml')} className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-bold flex justify-between items-center transition-all ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200' : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800'}`}>
                    <span>Keyhole Markup (.kml)</span>
                    <span className="text-emerald-500">↓</span>
                  </button>
                  <button onClick={() => handleExport('dxf')} className={`w-full py-3 px-4 rounded-xl border text-left text-xs font-bold flex justify-between items-center transition-all ${isDarkMode ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200' : 'bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-800'}`}>
                    <span>AutoCAD Exchange (.dxf)</span>
                    <span className="text-emerald-500">↓</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-700/50 text-[10px] text-slate-500 font-mono flex justify-between">
            <span>TERRABYTE CAD-AI v2.4</span>
            <span className="text-emerald-500 font-bold">READY</span>
          </div>
        </aside>

        {/* MAP DISPLAY CANVAS */}
        <div className={`flex-1 relative ${isDarkMode ? 'bg-[#07090E]' : 'bg-slate-200'}`}>
          <MapContainer center={[12.6911, 77.7463]} zoom={18} className="w-full h-full z-0">
            <MapController geoData={geoData} />
            <GeomanControls setSyncStatus={setSyncStatus} fetchParcels={fetchParcels} />
            <LayersControl position="topright">
              <BaseLayer checked name="Base Layer">
                <TileLayer url={tileUrl} />
              </BaseLayer>
              {geoData && (
                <Overlay checked name="Cadastral Vectors">
                  <InteractiveGeoJSON geoData={geoData} setHoveredParcel={setHoveredParcel} mapKey={mapKey} />
                </Overlay>
              )}
            </LayersControl>
          </MapContainer>

          {/* Detailed Floating Hover Tooltip */}
          {hoveredParcel && (
            <div
              className={`fixed z-50 pointer-events-none p-3.5 rounded-xl border shadow-2xl text-xs font-sans space-y-1.5 transition-opacity ${
                isDarkMode
                  ? 'bg-slate-900/95 text-slate-100 border-emerald-500/40 backdrop-blur-md'
                  : 'bg-white/95 text-slate-900 border-emerald-500/50 backdrop-blur-md shadow-emerald-500/10'
              }`}
              style={{ top: hoveredParcel.y + 12, left: hoveredParcel.x + 12 }}
            >
              <div className="text-emerald-500 font-extrabold border-b border-slate-700/40 pb-1 flex items-center justify-between gap-4">
                <span>{hoveredParcel.ward}</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/30">Active Vector</span>
              </div>
              <div className="text-[11px] flex justify-between gap-4">
                <span className="text-slate-400">Parcel ID:</span>
                <span className="font-mono font-bold">{hoveredParcel.id}</span>
              </div>
              <div className="text-[11px] flex justify-between gap-4">
                <span className="text-slate-400">Est. Area:</span>
                <span className="font-mono font-bold">{hoveredParcel.area}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-700/30">
                {hoveredParcel.lat}, {hoveredParcel.lng}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 6. ROUTER & GLOBAL THEME STATE
// ==========================================
export default function App() {
  const [geoData, setGeoData] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now());
  const [isDarkMode, setIsDarkMode] = useState(true);

  const fetchParcels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/parcels`);
      const data = await res.json();
      setGeoData(data);
      setMapKey(Date.now());
    } catch (err) {
      console.error("Error loading parcels:", err);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/login" element={<LoginPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/dashboard" element={<Dashboard geoData={geoData} mapKey={mapKey} fetchParcels={fetchParcels} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
        <Route path="/admin" element={<AdminPanel geoData={geoData} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
      </Routes>
    </Router>
  );
}