import React, { useEffect, useState } from 'react';
import axios from 'axios';



function FruitType() {
  const [fruits, setFruits] = useState([]);

  useEffect(() => {
    axios.get('/api/fruits') // Adjust URL if using proxy or full backend path
      .then(res => setFruits(res.data))
      .catch(err => console.error('Error fetching fruits:', err));
  }, []);

  return (
    <div className="fruit-card">
      {fruits.map(fruit => (
        <div key={fruit.id}>
          <h2 className="fruit-card h4">{fruit.fruit_name}</h2>
          <img className="fruit-card img" src={fruit.image_url} alt={fruit.fruit_name} style={{ maxWidth: '300px' }} />
          <p className="fruit-card p" ><strong>Season:</strong> {fruit.season}</p>
          <p className="fruit-card p" >{fruit.info}</p>
        </div>
      ))}
    </div>
  );
}

export default FruitType;


//     return(
        
//             <div className='fruit-card'>
//                 <h4 className="fruit-card h4"> Name: {fruit_name} </h4>
//                 <image className="fruit-card img"> {image_url} </image>
//                 <p className="fruit-card p"> Info: {info}</p>
//                 <p className="fruit-card p"> Season: {season}</p>
               
//             </div>
       
//     )
// }


// export default FruitType;
