import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAllMatchPages = async (url, params = {}) => {
  const pageSize = 100;
  const firstResponse = await api.get(url, {
    params: { ...params, page: 1, pageSize },
  });
  const { items, totalCount } = firstResponse.data;
  const pageCount = Math.ceil(totalCount / pageSize);

  if (pageCount <= 1) return items;

  const remainingPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, index) =>
      api.get(url, {
        params: { ...params, page: index + 2, pageSize },
      })
    )
  );

  return [
    ...items,
    ...remainingPages.flatMap(response => response.data.items),
  ];
};

export const getMatchOptions = async () => {
  const response = await api.get("/matches/options");
  return response.data;
};

export const getMatchFixtures = async filters => {
  return getAllMatchPages("/matches/fixtures", filters);
};

export const getMatchAnalysis = async filters => {
  return getAllMatchPages("/matches/analysis", filters);
};

export const getTeamMatches = async (team, filters = {}) => {
  return getAllMatchPages(`/matches/team/${encodeURIComponent(team)}`, filters);
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
