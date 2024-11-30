import toast from 'react-hot-toast';

export const ToastAlert = (message ) => {
  return toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export const ErrorAlert = (message ) => {
  return toast.error(message, {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export const Routes = [
  {
    role: 'admin',
    url: `/auth/admin`
  },
  {
    role: 'user',
    url: `/login`
  },]
export const updateSelection = (selected, id) => {
  if (!selected.includes(id)) {
    return [...selected, id];
  }
  return selected.filter((s) => s !== id);
};

export const checkIfAllSelected = (data, selected, objectKey = 'id') => {
  const allItemIds = data.map((item) => item[objectKey]);
  const isEveryOneSelected = allItemIds.every((id) => selected.includes(id));
  return isEveryOneSelected;
};

export const updateAllSelections = (data, selected, isAllSelected, objectKey = 'id') => {
  const allItemIds = data.map((item) => item[objectKey]);
  if (isAllSelected) {
    const filtered = selected.filter((id) => !allItemIds.includes(id));
    return filtered;
  }
  return [...selected, ...allItemIds];
};
export const EnumMemberStatus = {
  OFFLINE: 'OFFLINE',
  ONLINE: 'ONLINE',
  AWAY: 'AWAY',
  BUSY: 'BUSY'
};
