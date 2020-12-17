import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardcontainer: {
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  card: {
    borderRadius: 5,
    width: '45%',
    height: 130,
    marginBottom: 8,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    margin: 0,
    color: '#fff',
  },
  number: {
    fontSize: 50,
  },
  caption: {
    marginTop: 15,
    color: '#fff',
  },
  ripple: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
});

export default styles;
