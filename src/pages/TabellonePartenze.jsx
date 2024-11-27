import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoute } from '../features/routes/routeAsyncSlice';
import { fetchDepartures } from '../features/tabellonePartenze/tabellonePartenzeSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import { startLoading, stopLoading } from '../features/spinner/spinnerSlice';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { resetAll } from '../features/viaggio/findTratta';

export const TabellonePartenze = () => {
  const dispatch = useDispatch();
  const routes = useSelector((state) => state.route.route);
  const departures = useSelector((state) => state.tabellonePartenze.departures);
  const today = new Date().toISOString().split('T')[0]; // Format date as YYYY-MM-DD
  const navigate = useNavigate();
  const [selectedPort, setSelectedPort] = useState('');
  const [localDepartures, setLocalDepartures] = useState([]);
  const loadingIds = useSelector((state) => state.spinner.loadingIds);
  const isLoading = loadingIds.includes('fetchDepartures');

  useEffect(() => {
    dispatch(resetAll());

    dispatch(startLoading('fetchRoute'));
    dispatch(fetchRoute()).finally(() => {
      dispatch(stopLoading('fetchRoute'));
    });
  }, [dispatch]);

  const handleSelectChange = (event) => {
    const port = event.target.value;
    setSelectedPort(port);
    setLocalDepartures([]); // Clear current departures
    dispatch(startLoading('fetchDepartures'));
    dispatch(fetchDepartures({ departureDate: today, departurePort: port })).then((action) => {
      setLocalDepartures([...action.payload].sort((a, b) => new Date(a.departure) - new Date(b.departure)));
      dispatch(stopLoading('fetchDepartures'));
    });
  };

  const handleCartClick = (departure) => {
    const queryParams = new URLSearchParams({
      departure_route_id: departure.route_id,
      departure_data: today,

      adulti: 1,
 
    }).toString();
    window.location.href = `/results?${queryParams}`;  };

  const formatDuration = (departure, arrival) => {
    const diffMs = new Date(arrival) - new Date(departure);
    const diffMins = Math.round(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return hours > 0 ? ` ${hours}h ${minutes}m` : ` ${minutes}m`;
  };

  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="card col-8 p-3">
        <div className="card-header">
          Partenze di oggi: {today}
        </div>
        <div className="card-body">
          <select className="form-select mb-3" defaultValue="" onChange={handleSelectChange}>
            <option value="" disabled>
              Seleziona un porto
            </option>
            {routes && routes.map((route, index) => (
              <option key={index} value={route.codeFrom}>
                {route.from}
              </option>
            ))}
          </select>
          {isLoading && (
            <div className="spinner-border mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {!isLoading && selectedPort && localDepartures.length === 0 && (
            <div className="alert alert-info" role="alert">
              Non ci sono partenze previste per oggi
            </div>
          )}
          {localDepartures.map((departure, index) => (
            <div key={index} className={`card mb-2 ${index % 2 === 0 ? 'bg-light' : 'bg-custom'}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <span>
                  <strong>{departure.fromTo}</strong><br />
                  {new Date(departure.departure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &gt; 
                  {new Date(departure.arrive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | 
                  {formatDuration(departure.departure, departure.arrive)}
                </span>
                <span className="d-flex align-items-center">
                  {departure.price !== null ? `${departure.price} €` : departure.price} 
                  <button className="btn btn-primary ms-2" onClick={() => handleCartClick(departure)}>
                    <FaShoppingCart />
                  </button>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Add custom CSS for the custom background color
const style = document.createElement('style');
style.innerHTML = `
  .bg-custom {
    background-color: #e2ebfc !important;
  }
`;
document.head.appendChild(style);

