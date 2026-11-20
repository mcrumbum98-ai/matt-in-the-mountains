(() => {
  const projectId = 'azxzfjey';
  const dataset = 'production';
  const apiVersion = '2024-01-01';

  const query = async groq => {
    const endpoint =
      `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(groq)}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`CMS request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  };

  window.MITMCmsSanity = {
    query
  };
})();
