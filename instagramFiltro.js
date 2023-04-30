const axios = require('axios');

// Verifica que el usuario ha subido una story 

https://developers.facebook.com/docs/instagram-basic-display-api/getting-started#access-tokens

https://developers.facebook.com/docs/instagram-api/reference/ig-user/stories

async function getStories(userId, accessToken) {
  try {
    const response = await axios.get(`https://graph.instagram.com/${userId}/stories`, {
      params: {
        access_token: accessToken
      }
    });

    return response.data.data;
  } catch (error) {
    console.error(error);
    return []
  }
}

// Valida que la historia tiene un filtro determinado y se ha mantenido 12 h, habría que encontrar si existe una propiedad en stories que te de el tipo de filtor
function isStoryValid(story, filterName) {

  if (story.filter_type !== filterName) {
    return false;
  }

  const now = new Date();
  const createdAt = new Date(story.timestamp);
  const elapsedHours = (now - createdAt) / (1000 * 60 * 60);

  if (elapsedHours < 12) {
    return false;
  }

  return true;
}

// Recupera las menciones
async function getStoryMentions(storyId, accessToken) {
  try {
    const response = await axios.get(`https://graph.instagram.com/${storyId}/comments`, {
      params: {
        access_token: accessToken
      }
    });

    return response.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Ejemplo de cómo utilizar las funciones 

const userId = 'user-id'; // ID de usuario de Instagram
const accessToken = 'access-token'; // Clave de acceso autorizada para la API de Instagram
const filterName = 'filter-name'; // Nombre del filtro deseado

// coge las historias

const stories = await getStories(userId, accessToken);

// comprueba que la historia es valida
stories.forEach(async (story) => {
  if (isStoryValid(story, filterName)) {
    const storyMentions = await getStoryMentions(story.id, accessToken);
    console.log(`La historia ${story.id} cumple con los criterios y tiene ${storyMentions.length} menciones.`);
  }
});
