import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import _get from "lodash/get";
import ListGridView from '../../components/List/List';
import ProtectedRoute from '../redirection/ProtectedRoute'
import { employeeState, getUserList } from './employeeSlice';
import { AppDispatch } from '../../store/store';

function EmpployeeList() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector(employeeState);
  console.log("checkkaaaaa:::", data);

  useEffect(() => {
    dispatch(getUserList());
  }, []);

  const ItemRenderer = (item: any) => (
    <div className='flex justify-between'>
      <h3 className="font-bold">{item.fullname}</h3>
      <p>{item.dept}</p>
      <span>{item.doj}</span>
    </div>
  )
  return (
    <ListGridView filterFields={["dept", "doj"]} itemRenderer={ItemRenderer} itemsPerPage={10} />
  )
}

export default { path: "/employee-list", element: <ProtectedRoute element={<EmpployeeList />} /> }