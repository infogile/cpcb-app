import React from 'react';
import { View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import * as loginActions from 'app/store/actions/loginActions';
import styles from './styles';

const Login: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const dispatch = useDispatch();
  const onChangeEmail = (email: string) => setEmail(email);
  const onChangePassword = (password: string) => setPassword(password);
  const onLogin = () => dispatch(loginActions.requestLogin(email, password));
  const isLoginLoading = useSelector(
    (state: any) => state.loadingReducer.isLoginLoading,
  );
  return (
    <View style={styles.container}>
      <View style={{ width: '100%' }}>
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          label="username"
          placeholder="Enter your username"
          value={email}
          onChangeText={onChangeEmail}
        />
      </View>
      <View style={{ width: '100%' }}>
        <TextInput
          mode="outlined"
          style={styles.inputContainerStyle}
          label="Password"
          placeholder="Enter Your Password"
          value={password}
          onChangeText={onChangePassword}
          textContentType="password"
          secureTextEntry={true}
        />
      </View>
      <View style={{ width: '100%' }}>
        <Button
          mode="outlined"
          onPress={onLogin}
          icon="login"
          style={styles.inputContainerStyle}
          disabled={isLoginLoading}>
          Login
        </Button>
      </View>
    </View>
  );
};

export default Login;
