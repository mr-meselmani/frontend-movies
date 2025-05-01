import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from "@angular/forms"
import { MoviesService } from "./movies.service"
import { MovieDetails, Review } from "../../types/movies"

@Component({
  selector: "app-movies",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./movies.component.html",
  styleUrls: ["./movies.component.css"],
})
export class MoviesComponent {
  movie: MovieDetails | null = null
  reviews: Review[] = []
  searchQuery: string = ""
  isLoading = false
  error: string | null = null
  reviewForm: FormGroup
  isSubmitting = false

  constructor(private movieService: MoviesService, private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      reviewText: ["", [Validators.required, Validators.minLength(10)]],
    })
  }

  search(): void {
    if (this.searchQuery) {
      this.isLoading = true
      this.error = null

      this.movieService.searchMovies(this.searchQuery).subscribe({
        next: (response) => {
          this.movie = response.data.movie
          this.reviews = response.data.reviews
          this.isLoading = false
        },
        error: (err) => {
          this.error = "Failed to fetch movie"
          this.isLoading = false
          console.error("Error fetching movie:", err)
        },
      })
    }
  }

  onSubmitReview(): void {
    if (this.reviewForm.valid && this.movie) {
      this.isSubmitting = true
      const reviewText = this.reviewForm.get("reviewText")?.value

      this.movieService.submitReview(this.movie.imdbID, reviewText).subscribe({
        next: () => {
          this.search()
          this.reviewForm.reset()
          this.isSubmitting = false
        },
        error: (error) => {
          console.error("Error submitting review:", error)
          this.isSubmitting = false
        },
      })
    }
  }
}
