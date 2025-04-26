// Fetch the next available ID
export const getNextId = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    throw new Error(
      `Erreur lors de la récupération des données : ${response.status}`,
    );
  }

  const data = await response.json();

  // Trouver l'ID le plus élevé
  const maxId = data.reduce((max, data) => {
    return data.id > max ? data.id : max;
  }, 0);

  // Retourner l'ID suivant
  return maxId + 1;
};
