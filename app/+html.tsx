import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, Image } from 'react-native';
import axios from 'axios';

interface Team {
  _id: string;
  name: string;
  teamLogoUrl: string;
  // Adicione outros campos conforme necessário
}

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:4000/teams');
        setTeams(response.data.teams);
        setFilteredTeams(response.data.teams);
      } catch (err) {
        setError('Erro ao buscar dados das equipes.');
        console.error(err);
      }
    };

    fetchTeams();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/team/name/${searchQuery}`);
      setFilteredTeams([response.data.team]);
    } catch (err) {
      setError('Erro ao buscar equipe.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Buscar equipe..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button
        title={loading ? 'Buscando...' : 'Pesquisar'}
        onPress={handleSearch}
        disabled={loading}
      />

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}>
            <Image
              source={{ uri: `http://localhost:4000/teams/${item.teamLogoUrl}` }}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ fontSize: 20 }}>{item.name}</Text>
            {/* Adicione mais dados aqui, como os drivers */}
          </View>
        )}
      />
    </View>
  );
};

export default App;
