import  { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [electricians, setElectricians] = useState([]);
  const [sites, setSites] = useState([]);
  const [siteId, setSiteId] = useState('');
  const [newDate, setNewDate] = useState('');

  
  useEffect(() => {
    fetch('http://localhost:3000/electricians')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch electricians');
    }
    return response.json();
  })
  .then((data) => setElectricians(data))
  .catch((error) => console.error('Error fetching electricians:', error));


fetch('http://localhost:3000/sites')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch sites');
    }
    return response.json();
  })
  .then((data) => setSites(data))
  .catch((error) => console.error('Error fetching sites:', error));
  }, []);

  const handleChangeDate = () => {
    
    fetch(`http://localhost:3000/sites/${siteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ installationDate: newDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        
        setSites((prevSites) =>
          prevSites.map((site) => (site.name === data.name ? data : site))
        );
        setSiteId('');
        setNewDate('');
      });
  };

  const handleAssignElectricians = () => {
    fetch('http://localhost:3000/assign-electricians', {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to assign electricians. Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setSites(data);
        console.log('Auto-assignment result:', data);
      })
      .catch((error) => {
        console.error('Error assigning electricians:', error);
        
      });
  };

  return (
    <div className="App">
    <h1>Electrician Allocation System</h1>
      <h2>Electricians</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Electrician Name</th>
        </tr>
      </thead>
      <tbody>
        {electricians.map((electrician, index) => (
          <tr key={index}>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{electrician.name}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Sites</h2>
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
      <thead>
        <tr style={{ backgroundColor: '#f2f2f2' }}>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Site Name</th>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>City</th>
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Assigned Electricians</th>
        
          <th style={{ padding: '8px', border: '1px solid #ddd' }}>Grievence</th>
        </tr>
      </thead>
      <tbody>
        {sites.map((site, index) => (
          <tr key={index}>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{site.name}</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{site.city}</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{site.AssignedElectritian.length}</td>
            
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{site.grievance ? "grievence" : "general"}</td>
          </tr>
        ))}
      </tbody>
    </table>

      <h2>Change Installation Date</h2>
      <label htmlFor="siteId">Site ID:</label>
      <input
        type="text"
        id="siteId"
        placeholder="Enter site ID"
        value={siteId}
        onChange={(e) => setSiteId(e.target.value)}
      />
      <label htmlFor="newDate">New Installation Date:</label>
      <input
        type="date"
        id="newDate"
        value={newDate}
        onChange={(e) => setNewDate(e.target.value)}
      />
      <button style={{backgroundColor:'greenyellow'}}onClick={handleChangeDate}>Change Date</button>

      <h2>Auto-Assign Electricians</h2>
      <button style={{backgroundColor:'greenyellow'}} onClick={handleAssignElectricians}>Auto-Assign Electricians</button>
    </div>
  );
}

export default App;
