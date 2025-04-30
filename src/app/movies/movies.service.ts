import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovieResponse } from '../../types/movies';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private apiUrl = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(
      `${this.apiUrl}/movies/by-title?title=${query}`
    );
  }

  submitReview(movieId: string, reviewText: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews`, {
      movieId,
      reviewText,
    });
  }
}
