import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { fetchNeos } from './utils/api';
import { NeoObject } from './utils/api';

export default function Index() {
  const [neos, setNeos] = useState<NeoObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNeos();
  }, []);

  const loadNeos = async () => {
    try {
      const data = await fetchNeos();
      setNeos(data);
    } catch (err) {
      setError('Failed to load NEO data');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: NeoObject }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>Diameter: {item.diameter.average.toFixed(2)} feet</Text>
        <Text>Velocity: {item.velocity.toFixed(2)} mph</Text>
        <Text>Miss Distance: {item.missDistance.toFixed(2)} miles</Text>
        <Text>Hazardous: {item.hazardous ? 'Yes' : 'No'}</Text>
      </View>
  );

  if (loading) return <ActivityIndicator style={styles.container} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
      <View style={styles.container}>
        <FlatList
            data={neos}
            renderItem={renderItem}
            keyExtractor={item => item.name}
            contentContainerStyle={styles.list}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    margin: 16,
  },
});