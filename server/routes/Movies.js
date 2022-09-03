const express = require("express");
const app = express();
const axios = require("axios");

app.get("/get-shows", async (req, res) => {
  let movies = await axios.get(
    `${process.env.moviesApiURL}/trending/all/week${process.env.apiKey}`
  );
  let data = await movies.data;
  res.json(data.results.slice(0, 7));
});

app.post("/get-trailer", async (req, res) => {
  const { id, type } = req.body;
  let trailer = await axios.get(
    `${process.env.moviesApiURL}/${type}/${id}/videos${process.env.apiKey}`
  );
  const trailerData = await trailer.data.results
    .filter((i) => i.type === "Trailer")
    .slice(0, 1);
  res.json(trailerData);
});

app.get("/get-showByGenre", async (req, res) => {
  var data = {};

  const category = await axios.get(
    `${process.env.moviesApiURL}/genre/list${process.env.apiKey}`
  );

  var genres = await category.data.genres;

  await Promise.all(
    genres.map(async (g) => {
      var cate = await axios.get(
        `${process.env.moviesApiURL}/discover/tv${process.env.apiKey}&with_genres=${g.id}&sort_by=popularity.desc`
      );
      if (cate.data.results.length === 0) {
        cate = await axios.get(
          `${process.env.moviesApiURL}/discover/movie${process.env.apiKey}&with_genres=${g.id}&sort_by=popularity.desc`
        );
        await Promise.all(
          cate.data.results.map((item) => {
            item["media_type"] = "movie";
          })
        );
      } else {
        await Promise.all(
          cate.data.results.map((item) => {
            item["media_type"] = "tv";
          })
        );
      }

      data[g.name] = await cate.data.results;
    })
  );

  Object.keys(data).map(
    (item) =>
      (data[item] = data[item].filter(
        (d) => d.backdrop_path !== null && d.poster_path !== null
      ))
  );

  res.json(data);
});

app.get("/get-genres", async (req, res) => {
  const category = await axios.get(
    `${process.env.moviesApiURL}/genre/list${process.env.apiKey}`
  );

  var genres = await category.data.genres;
  res.json(genres);
});

app.post("/get-recommendations", async (req, res) => {
  const { id, type } = req.body;
  var recommends, data, credits;
  try {
    recommends = await axios.get(
      `${process.env.moviesApiURL}/tv/${id}/similar${process.env.apiKey}`
    );

    data = await recommends.data.results;

    if (data.length === 0) {
      recommends = await axios.get(
        `${process.env.moviesApiURL}/tv/${id}/recommendations/${process.env.apiKey}`
      );
      data = await recommends.data.results;
    }
  } catch (error) {
    try {
      recommends = await axios.get(
        `${process.env.moviesApiURL}/movie/${id}/similar${process.env.apiKey}`
      );
      data = await recommends.data.results;

      if (data.length === 0) {
        recommends = await axios.get(
          `${process.env.moviesApiURL}/movie/${id}/recommendations/${process.env.apiKey}`
        );
        data = await recommends.data.results;
      }
    } catch {}
  }
  res.json(data.sort((a, b) => b.popularity - a.popularity).slice(0, 6));
});

app.post("/get-credits", async (req, res) => {
  const { id, type } = req.body;
  var cast, data;
  try {
    cast = await axios.get(
      `${process.env.moviesApiURL}/movie/${id}/credits${process.env.apiKey}`
    );
    data = await cast.data.cast;
  } catch (error) {
    try {
      cast = await axios.get(
        `${process.env.moviesApiURL}/tv/${id}/credits${process.env.apiKey}`
      );
      data = await cast.data.cast;
    } catch (error) {}
  }
  res.json(data.filter((c) => c.known_for_department === "Acting"));
});

app.get("/search", async (req, res) => {
  const content = req.query.s;

  const searchRes = await axios(
    `${process.env.moviesApiURL}/search/multi${process.env.apiKey}&query=${content}`
  );
  const data = await searchRes.data.results;

  res.json(data);
});

app.post("/latest", async (req, res) => {
  var movie = {},
    tv = {};

  //movies
  var nowPlay = await axios.get(
    `${process.env.moviesApiURL}/movie/now_playing${process.env.apiKey}`
  );
  var data = nowPlay.data.results;

  var latest = await axios.get(
    `${process.env.moviesApiURL}/movie/latest${process.env.apiKey}`
  );
  data = data.concat(await latest.data);
  movie["latest"] = data;

  var upcomming = await axios.get(
    `${process.env.moviesApiURL}/movie/upcoming/${process.env.apiKey}`
  );
  data = await upcomming.data.results;
  movie["upcomming"] = data;

  //Tv
  latest = await axios.get(
    `${process.env.moviesApiURL}/tv/latest${process.env.apiKey}`
  );
  data = [await latest.data];

  nowPlay = await axios.get(
    `${process.env.moviesApiURL}/tv/airing_today${process.env.apiKey}`
  );
  data = [...data].concat(await nowPlay.data.results);
  tv["latest"] = data;

  Object.keys(movie).map(
    (m) =>
      (movie[m] = movie[m].filter(
        (item) => item.backdrop_path !== null && item.poster_path !== null
      ))
  );

  Object.keys(tv).map(
    (t) =>
      (tv[t] = tv[t].filter(
        (item) => item.backdrop_path !== null && item.poster_path !== null
      ))
  );
  res.json({ movie: movie, tv: tv });
});

app.post("/get-tv", async (req, res) => {
  var tv = {};

  // Top Rated
  const top = await axios.get(
    `${process.env.moviesApiURL}/tv/top_rated${process.env.apiKey}`
  );
  tv["top"] = await top.data.results;

  //Latest
  const latest = await axios.get(
    `${process.env.moviesApiURL}/tv/latest${process.env.apiKey}`
  );
  tv["latest"] = await latest.data.results;

  //on-air
  const on_air = await axios.get(
    `${process.env.moviesApiURL}/tv/airing_today${process.env.apiKey}`
  );
  tv["on-air"] = await on_air.data.results;

  const popular = await axios.get(
    `${process.env.moviesApiURL}/tv/popular${process.env.apiKey}`
  );
  tv["popular"] = await popular.data.results;

  Object.keys(tv).map((item) => {
    tv[item]?.map((i) => {
      i["media_type"] = "tv";
    });
  });
  res.json(tv);
});

app.post("/get-movies", async (req, res) => {
  var movie = {};

  // Top Rated
  const top = await axios.get(
    `${process.env.moviesApiURL}/movie/top_rated${process.env.apiKey}`
  );
  movie["top"] = await top.data.results;

  //Latest
  const latest = await axios.get(
    `${process.env.moviesApiURL}/movie/latest${process.env.apiKey}`
  );
  movie["latest"] = await latest.data.results;

  //now playing
  const now_playing = await axios.get(
    `${process.env.moviesApiURL}/movie/now_playing${process.env.apiKey}`
  );
  movie["Now Playing"] = await now_playing.data.results;

  const popular = await axios.get(
    `${process.env.moviesApiURL}/movie/popular${process.env.apiKey}`
  );
  movie["popular"] = await popular.data.results;

  Object.keys(movie).map((item) => {
    movie[item]?.map((i) => {
      i["media_type"] = "movie";
    });
  });
  res.json(movie);
});
module.exports = app;
