import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAllMatchPages = async (url, params = {}, signal) => {
  const pageSize = 100;
  const firstResponse = await api.get(url, {
    params: { ...params, page: 1, pageSize },
    signal,
  });
  const { items, totalCount } = firstResponse.data;
  const pageCount = Math.ceil(totalCount / pageSize);

  if (pageCount <= 1) return items;

  const allItems = [...items];
  const batchSize = 4;

  for (let firstPage = 2; firstPage <= pageCount; firstPage += batchSize) {
    signal?.throwIfAborted();
    const pages = Array.from(
      { length: Math.min(batchSize, pageCount - firstPage + 1) },
      (_, index) => firstPage + index
    );
    const responses = await Promise.all(
      pages.map(page =>
        api.get(url, {
          params: { ...params, page, pageSize },
          signal,
        })
      )
    );

    allItems.push(...responses.flatMap(response => response.data.items));
  }

  return allItems;
};

export const getMatchOptions = async signal => {
  const response = await api.get("/matches/options", { signal });
  return response.data;
};

export const getMatchFixtures = async (filters, signal) => {
  return getAllMatchPages("/matches/fixtures", filters, signal);
};

export const getMatchAnalysis = async (filters, signal) => {
  return getAllMatchPages("/matches/analysis", filters, signal);
};

export const getTeamMatches = async (team, filters = {}, signal) => {
  return getAllMatchPages(`/matches/team/${encodeURIComponent(team)}`, filters, signal);
};

export const getMatchById = async id => {
  const response = await api.get(`/matches/${id}`);
  return response.data;
};

// STANDINGS
export const getStandings = async (league = null, season = null) => {
  let url = "/standings";
  const params = [];
  if (league) params.push(`league=${encodeURIComponent(league)}`);
  if (season) params.push(`season=${encodeURIComponent(season)}`);
  if (params.length > 0) url += `?${params.join("&")}`;
  const res = await api.get(url);
  return res.data;
};

export const getCardStats = async (season, league) => {
  const response = await api.get("/statistics/cards", {
    params: { season, league },
  });

  return response.data;
};

export const getGoalStats = async (season, league) => {
  const response = await api.get("/statistics/goals", {
    params: { season, league },
  });

  return response.data;
};

export const getCornerStats = async (season, league) => {
  const response = await api.get("/statistics/corners", {
    params: { season, league },
  });

  return response.data;
};
