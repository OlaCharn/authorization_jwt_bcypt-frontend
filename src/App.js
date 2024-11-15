import { useContext, useEffect , useState} from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import { Context } from './index';
import {observer} from "mobx-react-lite"
import UserService from './services/UserService';

function App() {
  const {store} = useContext(Context)
  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
        store.checkAuth()
    }
  }, [store])

  async function getUsers() {
    try {
        const response = await UserService.fetchUsers();
        setUsers(response.data);
    } catch (e) {
        console.log(e);
    }
}

  // Добавляем проверку на загрузку данных
  if (store.isLoading) {
    return <div>Загрузка...</div>;
  }

  if (!store.isAuth){
    return(
      <LoginForm />
      
    )
  }

  return (
    <div >
      <h1> {store.isAuth ? `Пользователь авторизован ${store.user.email}` : "Авторизуйтесь!" } </h1>
      <h1>{store.user.isActivated ? 'Аккаунт подтвержден по почте' : 'ПОДТВЕРДИТЕ АККАУНТ!!!!'}</h1>
      <button onClick={()=>store.logout()} >Logout</button>
      <div>
          <button onClick={getUsers}>Получить пользователей</button>
      </div>
      {users.map(user =>
          <div key={user.email}>{user.email}</div>
      )}
    </div>
  );
}

export default observer(App);
