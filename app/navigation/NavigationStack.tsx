import * as React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { navigationRef } from './NavigationService';
import Profile from 'app/screens/Profile';
import Login from 'app/screens/Login';
import DashboardScreen from 'app/screens/Dashboard';
import InsepectionScreen from 'app/screens/Inspection';
import FactoryScreen from 'app/screens/Factory';
import ForgotPassword from 'app/screens/ForgotPassword';
import FormSubmission from 'app/screens/FormSubmission';
import CameraScreen from 'app/screens/Camera';
import { StatusBar } from 'react-native';
import { ILoginState } from 'app/models/reducers/login';
import Sos from 'app/screens/Sos';
import Sector from 'app/screens/Sector';
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const LoggedInStack = createStackNavigator();

const Tabs = createMaterialBottomTabNavigator();
const homeOptions = {
  tabBarIcon: 'home-account',
  tabBarLabel: 'Dashboard',
};
const SectorOptions = {
  tabBarIcon: 'account-settings',
  tabBarLabel: 'Inspection',
};

const ProfileOptions = {
  tabBarIcon: 'account',
  tabBarLabel: 'Profile',
};
interface IState {
  loginReducer: ILoginState;
}

interface IProps {
  theme: Theme;
}

const AuthNavigator = () => {
  const isLoggedIn = useSelector(
    (state: IState) => state.loginReducer.isLoggedIn,
  );
  return (
    <AuthStack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isLoggedIn ? 'push' : 'pop',
          // headerRight: () => <ThemeController />,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: isLoggedIn ? 'push' : 'pop',
          // headerRight: () => <ThemeController />,
        }}
      />
    </AuthStack.Navigator>
  );
};

const TabScreen = () => (
  <Tabs.Navigator>
    <Tabs.Screen
      name="Dashboard"
      component={DashboardStackScreen}
      options={homeOptions}
    />
    <Tabs.Screen
      name="Sectors"
      component={SectorStackScreen}
      options={SectorOptions}
    />
    <Tabs.Screen
      name="Profile"
      component={ProfileStackScreen}
      options={ProfileOptions}
    />
  </Tabs.Navigator>
);

const HomeStack = createStackNavigator();
const DashboardStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        title: 'Dashboard',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        // headerRight: () => <ThemeController />,
      }}
    />
  </HomeStack.Navigator>
);
const SectorStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Sector"
      component={Sector}
      options={{
        title: 'Inspection',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

        // headerRight: () => <ThemeController />,
      }}
    />
  </HomeStack.Navigator>
);
const ProfileStackScreen = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
  </HomeStack.Navigator>
);
const Inspection = createStackNavigator();
const InsepectionStackScreen = () => (
  <Inspection.Navigator>
    <Inspection.Screen name=" FactoryList" component={InsepectionScreen} />
  </Inspection.Navigator>
);

const LoggedInNavigator = () => (
  <LoggedInStack.Navigator headerMode="none">
    <Stack.Screen name="Home" component={TabScreen} />
  </LoggedInStack.Navigator>
);

const App: React.FC<IProps> = (props: IProps) => {
  const { theme } = props;
  const isLoggedIn = useSelector(
    (state: IState) => state.loginReducer.isLoggedIn,
  );

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen
              name="Home"
              component={LoggedInNavigator}
              // options={homeOptions}
              options={{ headerShown: false }}
            />

            <Inspection.Screen
              name="Factory"
              component={FactoryScreen}
              options={({ route }) => ({
                title: `${route.params.code} - ${route.params.unit}`,
              })}
            />
            <Inspection.Screen
              name="Factory Details"
              component={FormSubmission}
            />
            <Inspection.Screen
              name="Factory List"
              component={InsepectionScreen}
              options={({ route }) => ({
                title: `${route.params.sector}`,
              })}
            />
            <Inspection.Screen name="Report Factory" component={Sos} />
            <Inspection.Screen name="Camera" component={CameraScreen} />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={AuthNavigator}
            options={{
              // When logging out, a pop animation feels intuitive
              // You can remove this if you want the default 'push' animation
              animationTypeForReplace: isLoggedIn ? 'push' : 'pop',
              // headerRight: () => <ThemeController />,
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
