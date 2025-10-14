import React from 'react';
import { useLocation } from 'react-router-dom';
import { pizzaService } from '../service/service';
import View from './view';
import Button from '../components/button';
import { useBreadcrumb } from '../hooks/appNavigation';

export default function deleteUser() {
  const state = useLocation().state;
  const navigateToParentPath = useBreadcrumb();

  async function del() {
    await pizzaService.deleteUser(state.user);
    navigateToParentPath();
  }

  return (
    <View title='Are you sure you want to delete this user?'> 
      <div className='text-start py-8 px-4 sm:px-6 lg:px-8'>
        <Button title='Delete' onPress={del} />
        <Button title='Cancel' onPress={navigateToParentPath} className='bg-transparent border-neutral-300' />
      </div>
    </View>
  );
}
