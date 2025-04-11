import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { fetchNeos } from './utils/api';
import { NeoObject } from './utils/api';
import { mockNeos } from './utils/mockData';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Index() {
  const [neos, setNeos] = useState<NeoObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    loadNeos(selectedDateTime);
  }, [selectedDateTime]);

  const loadNeos = async (date: Date) => {
    try {
      setLoading(true);
      const USE_MOCK_DATA = true;
      const data = USE_MOCK_DATA ? mockNeos : await fetchNeos(date);
      setNeos(data);
    } catch (err) {
      setError('Failed to load NEO data');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDateTime(prev => {
        const newDate = new Date(date);
        newDate.setHours(prev.getHours(), prev.getMinutes());
        return newDate;
      });
    }
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedDateTime(prev => {
        const newDate = new Date(prev);
        newDate.setHours(time.getHours(), time.getMinutes());
        return newDate;
      });
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
        <View style={styles.listContainer}>
          {loading ? (
              <ActivityIndicator style={styles.loader} />
          ) : error ? (
              <Text style={styles.error}>{error}</Text>
          ) : (
              <FlatList
                  data={neos}
                  renderItem={renderItem}
                  keyExtractor={item => item.name}
                  contentContainerStyle={styles.list}
              />
          )}
        </View>
        <View style={styles.datePickerContainer}>
            <DateTimePicker
                value={selectedDateTime}
                mode="date"
                display="compact"
                onChange={onDateChange}
                style={styles.datePicker}
                themeVariant="light"
                textColor="#000000"
            />
            <Pressable
                style={styles.timeButton}
                onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                {selectedDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </Pressable>
          {showTimePicker && (
              <DateTimePicker
                  value={selectedDateTime}
                  mode="time"
                  display="spinner"
                  onChange={onTimeChange}
                  style={styles.timePicker}
              />
          )}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6bbdf8',
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: 'rgba(205,222,255,0.5)',
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
  loader: {
    flex: 1,
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePicker: {
    // flex: 1,
    // height: 120,
    width: 120
  },
  timePicker: {
    height: 100,
  },
  timeButton: {
    backgroundColor: '#6bbdf8',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
    width: 100,
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});