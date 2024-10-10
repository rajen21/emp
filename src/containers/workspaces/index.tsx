import { useDispatch, useSelector } from 'react-redux'
import ListView from '../../components/List'
import ProtectedRoute from '../redirection/ProtectedRoute'
import { getWorkspaces, workspaceState } from './workspaceSliice';
import { useEffect } from 'react';
import { AppDispatch } from '../../store/store';

function Workspace() {
  const dispatch: AppDispatch = useDispatch();
  const data = useSelector(workspaceState);
  console.log("data", data);
  
  useEffect(() => {
    dispatch(getWorkspaces());
  }, [])
  return ("hello"
    // <ListView items={} onDelete={} key={} />
  )
}

export default {path: "/workspaces", element: <ProtectedRoute element={<Workspace />} />}