require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");

app.post("/get-shows", async (req, res) => {
  
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

app.post("/get-showByGenre", async (req, res) => {
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

  res.json({ data: data, genres: genres });
});

app.post("/get-genres", async (req, res) => {
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

    data.map((d) => {
      d["media_type"] = "tv";
    });
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
      data.map((d) => {
        d["media_type"] = "movie";
      });
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

app.post("/search", async (req, res) => {
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

  Object.keys(tv).map((t) => {
    tv[t].map((d) => {
      d["media_type"] = "tv";
    });
  });

  Object.keys(movie).map((m) => {
    movie[m].map((d) => {
      d["media_type"] = "movie";
    });
  });

  res.json({ movie: movie, tv: tv });
});

app.post("/genre/:genre", async (req, res) => {
  const genre = req.params.genre;
  var data = {};

  if (genre === "tv") {
    // Top Rated
    const top = await axios.get(
      `${process.env.moviesApiURL}/tv/top_rated${process.env.apiKey}`
    );
    data["top"] = await top.data.results;

    //Latest
    const latest = await axios.get(
      `${process.env.moviesApiURL}/tv/latest${process.env.apiKey}`
    );
    data["latest"] = await latest.data.results;

    //on-air
    const on_air = await axios.get(
      `${process.env.moviesApiURL}/tv/airing_today${process.env.apiKey}`
    );
    data["on-air"] = await on_air.data.results;

    const popular = await axios.get(
      `${process.env.moviesApiURL}/tv/popular${process.env.apiKey}`
    );
    data["popular"] = await popular.data.results;

    Object.keys(data).map((item) => {
      data[item]?.map((i) => {
        i["media_type"] = "tv";
      });
    });
  } else if (genre === "movies") {
    // Top Rated
    const top = await axios.get(
      `${process.env.moviesApiURL}/movie/top_rated${process.env.apiKey}`
    );
    data["top"] = await top.data.results;

    //Latest
    const latest = await axios.get(
      `${process.env.moviesApiURL}/movie/latest${process.env.apiKey}`
    );
    data["latest"] = await latest.data.results;

    //now playing
    const now_playing = await axios.get(
      `${process.env.moviesApiURL}/movie/now_playing${process.env.apiKey}`
    );
    data["Now Playing"] = await now_playing.data.results;

    const popular = await axios.get(
      `${process.env.moviesApiURL}/movie/popular${process.env.apiKey}`
    );
    data["popular"] = await popular.data.results;

    Object.keys(data).map((item) => {
      data[item]?.map((i) => {
        i["media_type"] = "movie";
      });
    });
  } else {
    var cate = await axios.get(
      `${process.env.moviesApiURL}/discover/tv${process.env.apiKey}&with_genres=${genre}`
    );
    data["tv"] = await cate.data.results;

    cate = await axios.get(
      `${process.env.moviesApiURL}/discover/movie${process.env.apiKey}&with_genres=${genre}`
    );
    data["movie"] = await cate.data.results;
    await Promise.all(
      Object.keys(data).map((d) =>
        data[d].map((item) => {
          item["media_type"] = d;
        })
      )
    );
  }

  res.json(data);
});

module.exports = app;
