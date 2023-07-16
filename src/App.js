
import { useEffect, useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTransactions()
  }, [])

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions'
    const response = await fetch(url)
    response.json().then((transactions)=>{
      setTransactions(transactions)

    })
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction'
    const price = name.split(' ')[0]
    setLoading(true)
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
    }).finally(() => {
      setLoading(false)

    })
  }

  function deleteItem(id) {
    const url = process.env.REACT_APP_API_URL + '/delete'
    fetch(url, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })

    }).then(()=>{
      getTransactions()
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
            placeholder={'-200 food'}></input>
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
        {loading ? (
          <button type="submit">
            <img src="/loading.gif" width={20} height={20} alt="loader" />
          </button>
        ) : (
          <button type="submit">
            <span>Add New transaction</span>
          </button>
        )}
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transactions => (
          <div className='transaction' key={transactions._id}>
            <div className='left'>

              <div className='name'>
                {transactions.name}
              </div>
              <div className='description'>{transactions.description}</div>
            </div>
            <div className='right'>
              <div>

                <div className={'price ' + (transactions.price < 0 ? 'red' : 'green')} >{transactions.price}</div>
                <div className='datetime'>2022-12-18 </div>
              </div>
              <div onClick={() => deleteItem(transactions._id)}>
                <DeleteOutlinedIcon />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main >
  );
}

export default App;
