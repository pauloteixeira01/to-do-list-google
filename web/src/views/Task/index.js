import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { format } from 'date-fns';

import api from '../../services/api';
import isConnected from '../../utils/isConnected';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import TypeIcons from '../../utils/typeIcons';

import * as S from './styles';

function Business({ match }) {
  const [ redirect, setRedirect ] = useState(false);
  const [ type, setType ] = useState();
  const [ done, setDone ] = useState(false);
  const [ name, setName ] = useState();
  const [ description, setDescription ] = useState();
  const [ date, setDate ] = useState();
  const [ hour, setHour ] = useState();
  const [ minute, setMinute ] = useState();
  

  async function LoadTaskDetails() {
    await api.get(`/task/${match.params.id}`)
    .then(response => {
      setType(response.data.type)
      setDone(response.data.done)  
      setName(response.data.name)
      setDescription(response.data.description)
      setDate(format(new Date(response.data.when), 'yyyy-MM-dd'))
      setHour(format(new Date(response.data.when), 'HH:mm'))
    })
  }

  async function Save() {
   
    if (!name) {
      return alert('You need to inform what title of task.');
    } else if (!description) {
      return alert('You need to inform what description of task.');
    } else if (!type) {
      return alert('You need to inform what type of task.')
    } else if (!date) {
      return alert('You need to inform what date of task.')
    } else if (!hour) {
      return alert('You need to inform what hour with two numbers.')
    }

    if(hour > 12 || hour < 0) {
      return alert('You need to inform a correct hour.')
    }

    if(!minute) {
      return alert('You need to inform what minute with two numbers.')
    }

    if(minute > 59 || minute < 0) {
      return alert('You need to inform a correct minutes.')
    }

    if (match.params.id) {
      await api.put(`/task/${match.params.id}`,{
        macaddress: isConnected,
        done,
        type,
        name,
        description,
        when: `${date}T${hour}:${minute}:00.000`
      }).then(() => setRedirect(true))
    } else { 
      await api.post('/task',{
        macaddress: isConnected,
        type,
        name,
        description,
        when: `${date}T${hour}:${minute}:00.000`
      }).then(() => setRedirect(true))
    } 
  }

  async function Remove() {
    const res = window.confirm('Are you sure you want to delete the task?');
    if (res === true) {
      await api.delete(`/task/${match.params.id}`)
      .then(() => setRedirect(true)); 
    }   
  }

  useEffect(() => {
    if (!isConnected) {
      setRedirect(true);
    }
    LoadTaskDetails();
  }, [])  
 
  return (
    <S.Container>
      { redirect && <Redirect to="/" /> }
      <Header /> 

      <S.Form>
        <S.TypeIcons>
          {
            TypeIcons.map((icon, index) => (
              index > 0 && 
              <button type="button" onClick={() => setType(index)}>
                <img src={icon} alt="Task Type" 
                className={type && type !== index && 'inative'}/>
              </button>
            ))
          }
        </S.TypeIcons>

        <S.Input>
          <span>TITLE</span>
          <input type="text" placeholder="Type a title for the task." 
          onChange={e => setName(e.target.value)} value={name} />
        </S.Input>

        <S.TextArea>
          <span>DESCRIPTION</span>
          <textarea rows={5} placeholder="Describe your task here." 
          onChange={e => setDescription(e.target.value)} value={description}/>
        </S.TextArea>

        <S.Input>
          <span>DATE</span>
          
          <input type="date" onChange={e => setDate(e.target.value)} value={date}/>
        </S.Input>
        
        <S.Input>
          <span>HOUR</span>
          <input type="number" placeholder='Hour with 2 numbers' onChange={e => setHour(e.target.value)} value={hour} maxLength={2}/>
          <input type="number" placeholder='Minutes with 2 numbers' onChange={e => setMinute(e.target.value)} value={minute} maxLength={2}/>         
        </S.Input>

        <S.Options>
          {match.params.id && <button type="button" onClick={Remove} >DELETE</button>}
        </S.Options>

        <S.Save>
          <button type="button" onClick={Save}>SAVE</button>
        </S.Save>

      </S.Form>

      <Footer /> 
    </S.Container>
  )    
}

export default Business;
