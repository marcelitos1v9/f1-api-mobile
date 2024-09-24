import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, FlatList, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';

interface Team {
  _id: string;
  name: string;
  teamLogoUrl: string;
}

interface Driver {
  _id: string;
  name: string;
}

const App: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Defina a variável para o endereço IP
  const baseUrl = 'http://192.168.0.104:4000';

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${baseUrl}/teams`);
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
      const response = await axios.get(`${baseUrl}/team/name/${searchQuery}`);
      setFilteredTeams([response.data.team]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.message);
      } else {
        setError('Erro ao buscar equipe.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTeamPress = async (teamId: string) => {
    setLoading(true);
    try {
      // Altere a rota para usar a rota correta para buscar pilotos
      const response = await axios.get(`${baseUrl}/team/${teamId}/drivers`);
      setDrivers(response.data.drivers);
      const team = teams.find((t) => t._id === teamId);
      setSelectedTeam(team || null);
    } catch (err) {
      setError('Erro ao buscar pilotos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedTeam(null);
    setDrivers([]);
  };

  return (
    <View style={styles.container}>
      {/* Espaço para a logo da API */}
      <Image
        source={{ uri: `${baseUrl}/static/logo.png` }} // Atualize para a URL da logo da sua API
        style={styles.apiLogo}
      />

      <TextInput
        placeholder="Buscar equipe..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <Button
        title={loading ? 'Buscando...' : 'Pesquisar'}
        onPress={handleSearch}
        disabled={loading}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const imageUrl = `${baseUrl}/static/teams/${item.teamLogoUrl}`;
          return (
            <TouchableOpacity onPress={() => handleTeamPress(item._id)}>
              <View style={styles.card}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.logo}
                  onError={() => console.error('Error loading image')}
                />
                <Text style={styles.teamName}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {selectedTeam && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={!!selectedTeam}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedTeam.name}</Text>
            <FlatList
              data={drivers}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <Text style={styles.driverName}>{item.name}</Text>}
            />
            <Button title="Fechar" onPress={closeModal} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  apiLogo: {
    width: 200, // Ajuste a largura conforme necessário
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
  },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  logo: {
    width: 150, // Largura da imagem aumentada
    height: 100,
    marginBottom: 10,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  driverName: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default App;
