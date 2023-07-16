
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState('')

  useEffect(() => {
    getTransactions().then(transactions => {
      setTransactions(transactions)
    })
  }, [])

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions'
    const response = await fetch(url)
    return await response.json()
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction'
    const price = name.split(' ')[0]

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, name: name.substring(price.length + 1), description, datetime })

    }).then(response => {
      console.log(response,);
      response.json().then(json => {
        setName("");
        setDateTime("");
        setDescription("");
        setTransactions([...transactions, json]);
      })
    })
  }

  let balance = 0
  for (const transaction of transactions) {
    balance = balance + transaction.price
  }

  balance = balance.toFixed(2)
  const fraction = balance.split('.')[1]
  balance = balance.split('.')[0]
  return (
    <main>
      <h1>${balance} <span>{fraction}</span> </h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type='text'
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'+200 samsung tv'}></input>
          <input
            value={datetime}
            onChange={ev => setDateTime
              (ev.target.value)} type='datetime-local'></input>
        </div>

        <div className='description'>
          <input type='text'
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder={'description'}></input>
        </div>
        <button type='submit'> Add New transaction</button>

      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transactions => (
          <div className='transaction'>
            <div className='left'>

              <div className='name'>
                {transactions.name}
              </div>
              <div className='description'>{transactions.description}</div>
            </div>
            <div className='right'>
              <div className={'price ' + (transactions.price < 0 ? 'red' : 'green')} >{transactions.price}</div>
              <div className='datetime'>2022-12-18 </div>
            </div>
          </div>
        ))}
      </div>
    </main >
  );
}

export default App;
