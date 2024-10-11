import { useDispatch, useSelector } from 'react-redux'
import ListView from '../../components/List'
import ProtectedRoute from '../redirection/ProtectedRoute'
import { getWorkspaces, workspaceState } from './workspaceSliice';
import { useEffect } from 'react';
import _get from "lodash/get";
import { AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';

function Workspace() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(workspaceState);
  console.log("data", data);
  const onClick = () => {
    navigate("/create-workspace");
  };

  const onListClick = (id: string) => {
    console.log("list clickedd::::");
    navigate(`/edit-workspace/${id}`)
  }
  
  useEffect(() => {
    dispatch(getWorkspaces({}));
  }, []);

  return (
      <ListView items={_get(data, "workspaces.workspacedata")} buttonLable='Add Workspace' onClick={onClick} onListClick={onListClick} />
  )
}

export default {path: "/workspaces", element: <ProtectedRoute element={<Workspace />} />}