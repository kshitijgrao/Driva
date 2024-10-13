import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
// import Icon from 'react-native-vector-icons';


// npx react-native init DrivingScoreApp
// cd DrivingScoreApp
// npm install react-native-chart-kit react-native-svg react-native-vector-icons react-native-safe-area-context

interface ScoreCategory {
  speed: number;
  safety: number;
  awareness: number;
}

interface Score {
  id: number;
  name: string;
  categories: ScoreCategory;
  totalScore: number;
}

export default function home() {
  const [scores, setScores] = useState<Score[]>([
    { id: 1, name: "Alice", categories: { speed: 90, safety: 95, awareness: 88 }, totalScore: 91 },
    { id: 2, name: "Bob", categories: { speed: 85, safety: 92, awareness: 78 }, totalScore: 85 },
    { id: 3, name: "Charlie", categories: { speed: 88, safety: 90, awareness: 92 }, totalScore: 90 },
    { id: 4, name: "David", categories: { speed: 75, safety: 80, awareness: 85 }, totalScore: 80 },
  ]);
  const [newName, setNewName] = useState("");
  const [newSpeed, setNewSpeed] = useState("");
  const [newSafety, setNewSafety] = useState("");
  const [newAwareness, setNewAwareness] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addOrUpdateScore = () => {
    if (newName && newSpeed && newSafety && newAwareness) {
      const speed = parseInt(newSpeed);
      const safety = parseInt(newSafety);
      const awareness = parseInt(newAwareness);
      if (!isNaN(speed) && !isNaN(safety) && !isNaN(awareness)) {
        const totalScore = Math.round((speed + safety + awareness) / 3);
        const newScore: Score = {
          id: editingId || scores.length + 1,
          name: newName,
          categories: { speed, safety, awareness },
          totalScore
        };
        if (editingId) {
          setScores(scores.map(score => score.id === editingId ? newScore : score));
          setEditingId(null);
        } else {
          setScores([...scores, newScore]);
        }
        setNewName("");
        setNewSpeed("");
        setNewSafety("");
        setNewAwareness("");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const editScore = (score: Score) => {
    setEditingId(score.id);
    setNewName(score.name);
    setNewSpeed(score.categories.speed.toString());
    setNewSafety(score.categories.safety.toString());
    setNewAwareness(score.categories.awareness.toString());
  };

  const deleteScore = (id: number) => {
    Alert.alert(
      "Delete Score",
      "Are you sure you want to delete this score?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => setScores(scores.filter(score => score.id !== id)) }
      ]
    );
  };

  const filteredScores = useMemo(() => {
    return scores.filter(score => 
      score.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scores, searchTerm]);

  const sortedScores = useMemo(() => {
    return [...filteredScores].sort((a, b) => b.totalScore - a.totalScore);
  }, [filteredScores]);

  const chartData = {
    labels: sortedScores.map(score => score.name),
    datasets: [
      {
        data: sortedScores.map(score => score.totalScore)
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Friend's Driving Score Leaderboard</Text>
        
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={300}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 1 }]}>Rank</Text>
          <Text style={[styles.headerCell, { flex: 3 }]}>Name</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Total Score</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Actions</Text>
        </View>

        {sortedScores.map((score, index) => (
          <View key={score.id} style={[styles.tableRow, index === 0 && styles.topRank]}>
            <Text style={[styles.cell, { flex: 1 }]}>
              {index === 0 ? '🏆 ' : ''}{index + 1}
            </Text>
            <Text style={[styles.cell, { flex: 3 }]}>{score.name}</Text>
            <Text style={[styles.cell, { flex: 2 }]}>{score.totalScore}</Text>
            <View style={[styles.cell, { flex: 2, flexDirection: 'row', justifyContent: 'space-around' }]}>
              <TouchableOpacity onPress={() => editScore(score)}>
                {/* <Icon name="pencil" size={20} color="#007AFF" /> */}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteScore(score.id)}>
                {/* <Icon name="delete" size={20} color="#FF3B30" /> */}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.form}>
          <Text style={styles.formTitle}>{editingId ? "Edit Score" : "Add New Score"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Friend's Name"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Speed Score"
            value={newSpeed}
            onChangeText={setNewSpeed}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Safety Score"
            value={newSafety}
            onChangeText={setNewSafety}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Awareness Score"
            value={newAwareness}
            onChangeText={setNewAwareness}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={addOrUpdateScore}>
            <Text style={styles.buttonText}>{editingId ? "Update Score" : "Add Score"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  headerCell: {
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  topRank: {
    backgroundColor: '#fff9c4',
  },
  cell: {
    justifyContent: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

