import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Caption, Card, Text } from 'react-native-paper';
import styles from './styles';

function wishMe() {
  var data = [
      [0, 4, 'Welcome'],
      [5, 11, 'Good morning'], //Store messages in an array
      [12, 17, 'Good afternoon'],
      [18, 24, 'Good evening'],
    ],
    hr = new Date().getHours();

  for (var i = 0; i < data.length; i++) {
    if (hr >= data[i][0] && hr <= data[i][1]) {
      // console.log(data[i][2]);
      return data[i][2];
    }
  }
}

const Dashboard: React.FC = () => {
  const dashboard = useSelector((state: any) => state.dashboardReducer);
  const username = useSelector((state: any) => state.loginReducer.username);
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <Caption style={{ marginLeft: 10, fontSize: 15, marginTop: 10 }}>
            {wishMe()}, {username}
          </Caption>
          <View style={styles.cardcontainer}>
            <Card style={styles.card}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#A3D23F',
                }}>
                <Text style={styles.title}>{dashboard.totalAssigned}</Text>
                <View>
                  <Text style={styles.caption}>Total Assigned Units</Text>
                </View>
              </View>
            </Card>
            <Card style={styles.card}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#127D79',
                }}>
                <Text style={styles.title}>{dashboard.totalInspected}</Text>
                <View>
                  <Text style={styles.caption}>Inspections Done</Text>
                </View>
              </View>
            </Card>
            <Card style={styles.card}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#FF9900',
                }}>
                <Text style={styles.title}>{dashboard.totalClosed}</Text>
                <View>
                  <Text style={styles.caption}>Closed Factories</Text>
                </View>
              </View>
            </Card>
            <Card style={styles.card}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  backgroundColor: '#DB2222',
                }}>
                <Text style={styles.title}>{dashboard.totalBypass}</Text>
                <View>
                  <Text style={styles.caption}>Bypass</Text>
                </View>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
