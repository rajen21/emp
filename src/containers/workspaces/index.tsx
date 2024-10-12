import { useDispatch, useSelector } from 'react-redux'
import ListView from '../../components/List'
import ProtectedRoute from '../redirection/ProtectedRoute'
import { getWorkspaces, workspaceState } from './workspaceSliice';
import { useEffect } from 'react';
import _get from "lodash/get";
import { AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { homeState, fetchUser } from '../home/homeSlice';

function Workspace() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUser = useSelector(homeState);
  const data = useSelector(workspaceState);
  console.log("data", data);
  if (!loggedUser.isLoading && loggedUser.data?.role === "employee"){
    navigate("/not-found");
    return;
  }
  const onClick = () => {
    navigate("/create-workspace");
  };

  const onListClick = (id: string) => {
    console.log("list clickedd::::");
    navigate(`/edit-workspace/${id}`)
  }
  
  useEffect(() => {
    dispatch(getWorkspaces({params: {}}));
    dispatch(fetchUser());
  }, []);

  return (
      <ListView items={_get(data, "workspaces.workspacedata")} buttonLable='Add Workspace' onClick={onClick} onListClick={onListClick} />
  )
}

export default {path: "/workspaces", element: <ProtectedRoute element={<Workspace />} />}