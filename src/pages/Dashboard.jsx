import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const account = useSelector((state) => state.account.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (!account || !account.authorities.includes('ROLE_WEB_ADMIN')) {
      navigate('/');
    }
  }, [account, navigate]);

  return (
    <div style={
      {
        width: '100%',
        height: '92%',
        position: 'absolute',
        top: 60,
        left: 0
      }
    }>
      {/* ...Dashboard content... */}
      <iframe
        width="100%"
        height="100%"
        src="https://lookerstudio.google.com/embed/reporting/d2a380de-7276-40aa-b355-6c9d003b7507/page/7LOFE"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
};
