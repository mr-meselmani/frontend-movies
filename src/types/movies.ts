export interface Movie {
  id: string
  title: string
  year: string
  poster: string
  plot: string
}

export interface MovieResponse {
  message: string
  data: {
    movie: MovieDetails
    reviews: Review[]
  }
}

export interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Poster: string;
  imdbID: string;
  imdbRating: string;
  BoxOffice: string;
  Ratings: Rating[];
}

// Add a new interface for Rating
export interface Rating {
  Source: string;
  Value: string;
}

export interface Review {
  id: string
  movieId: string
  reviewText: string
  username: string
  createdAt: {
    _seconds: number
    _nanoseconds: number
  }
}
