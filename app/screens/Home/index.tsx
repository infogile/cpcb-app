import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import * as loginActions from 'app/store/actions/loginActions';
import styles from './styles';
import BottomTabs from './BottomTabs';
const Home: React.FC = () => {
  const dispatch = useDispatch();

  return <BottomTabs />;
};

export default Home;
