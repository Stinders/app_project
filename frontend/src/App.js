import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { format } from "date-fns";
import './App.css';

const ServerUrl = "http://localhost:5000";

function App() {


  const [description, setDescription] = useState("");
  const [eventList, setEventList] = useState([]);
  const [editDescription, setEditDescription] = useState("");
  const [eventId, setEventId] = useState("");



  const fetchEvents = async () => {
    const data = await axios.get(`${ServerUrl}/events`)
    const { events } = data.data
    setEventList(events);

    console.log("DATA :", data)
  }

  useEffect(() => {
    fetchEvents();
  }, [])


  const handleChange = (e, field) => {
    ;
    if (field === 'edit') {
      setEditDescription(e.target.value);
    }
    else {
      setDescription(e.target.value);
    }
    // setDescription(e.target.value);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${ServerUrl}/events/${id}`)
      const updatedList = eventList.filter(event => event.id !== id)
      setEventList(updatedList)
    } catch (error) {
      console.error(error.message)
    }
  }
  const EditHandler = (event) => {
    setEditDescription(event.description);
    setEventId(event.id);
  }

  const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editDescription) {
        const data = await axios.put(`${ServerUrl}/events/${eventId}`, { description: editDescription });
        const updatedEvent = data.data.event;
        const updatedList = eventList.map(event => {
          if (event.id === eventId) {
            return event = updatedEvent
          }
          return event
        })
        setEventList(updatedList)
      }
      else {
        const data = await axios.post(`${ServerUrl}/events`, { description })
        setEventList([...eventList, data.data]);
        // setDescription("");
      }
      setDescription('');
      setEditDescription('');
      setEventId(null);
    }
    catch (error) {
      console.error(error.message)
    }
  };


  return (
    // <div className="container">
    //   <div className='row'><section className='todo-form col-9'> 
    //   </section>
        
    //   </div>
      
     
      
  <div><div className="container-fluid " tabindex="-1" >
  <div className="Header-app">
    <h1>Welcome! to my Daily List App</h1>
    <div className="Header-content container main-heading">
      <div className="header-content">
        {/* <h5 className="modal-title">Modal title</h5> */}
        <form onSubmit={SubmitHandler} >
    <label htmlFor="description">Description</label>
    <input
      type="text"
      name="description"
      id="description"
      value={description}
      required
      onChange={(e) => handleChange(e, 'description')}
    />
    <button type="submit" className='btn btn-success btn-sm' >Submit</button>
  </form></div>
      <div className="modal-body">
      {/* <table className='table'>
          {eventList.map(event => {
            if (eventId === event.id) {
              return (
                <tr className='list-group-item  ' key={event.id}>
                  <form onSubmit={SubmitHandler}>
                    <input
                      type="text"
                      name="editDescription"
                      id="editDescription"
                      value={editDescription}
                      onChange={(e) => handleChange(e, 'edit')}
                    />
                    <button>Update</button>
                  </form>
          </tr>
        )
      }
      else {
        return (
          <tr key={event.id} className='border-tr'>
            {format(new Date(event.created_at), "MM/dd, p")}:{" "}
            {event.description}
            <button onClick={() => handleDelete(event.id)}>Delete</button>
            <button onClick={() => EditHandler(event)}>Edit</button>
          </tr>
        )
      }
    })}
  </table> */}
  <table className='table'>
  <thead>
    <tr className='text-center'>
      <th>Date & Time</th>
      <th>Description</th>
      <th>Actions</th>
      
      
    </tr>
  </thead>
  <tbody>
    {eventList.map(event => {
      if (eventId === event.id) {
        return (
          <tr className='list-group-item' key={event.id}>
            <td colSpan="2">
              <form onSubmit={SubmitHandler}>
                <input
                  type="text"
                  name="editDescription"
                  id="editDescription"
                  value={editDescription}
                  onChange={(e) => handleChange(e, 'edit')}
                  required
                />
                <button className='btn btn-success btn-sm'>Update</button>
              </form>
            </td>
            {/* <td></td> */}
          </tr>
        )
      }
      else {
        return (
          <tr key={event.id} className='border-tr'>
            <td>{format(new Date(event.created_at), "MM/dd/yy, p")}</td>
            <td>{event.description}</td>
            <td>
              <button className='btn btn-danger btn-sm' onClick={() => handleDelete(event.id)}>DELETE</button>
              
              <button className='tn btn-primary btn-sm' onClick={() => EditHandler(event)}>EDIT</button>
              </td>
              
          </tr>
        )
      }
    })}
  </tbody>
</table>


      </div>
      
    </div>
  </div>
</div></div>
  );
}
export default App;
