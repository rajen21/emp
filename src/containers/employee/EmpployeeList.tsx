import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import _get from "lodash/get";
import ListGridView from '../../components/List/List';
import ProtectedRoute from '../redirection/ProtectedRoute'
import { employeeState, Empployee, getUserList } from './employeeSlice';
import { AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { fetchUser, homeState } from '../home/homeSlice';

function EmpployeeList() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector(employeeState);
  const loggedUser = useSelector(homeState);
  const navigate = useNavigate();
  console.log("checkkaaaaa:::", data);

  const navigateTo = (path: string) => {
    navigate(path);
  }

  const onClickItem = (id: string) => {
    navigate(`/edit-employee/${id}`);
  }

  const ItemRenderer = (item: Empployee) => (
    <div className='flex employee-center' onClick={() => onClickItem(item._id)}>
      <h3 className="font-bold">{item.fullname}</h3>
      <p>{item.dept}</p>
      <span>{item.doj}</span>
      <span>{item.role === "employee" ? "Employee" : "Workspace Admin"}</span>
    </div>
  )

  useEffect(() => {
    dispatch(getUserList());
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <ListGridView 
      filterFields={["dept", "doj"]} 
      itemRenderer={ItemRenderer} 
      itemsPerPage={10} 
      pathTONavigate='/create-employee' 
      navigate={navigateTo}
      loggedUser={loggedUser.data}
    />
  )
}

export default { path: "/employee-list", element: <ProtectedRoute element={<EmpployeeList />} /> }