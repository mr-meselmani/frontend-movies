import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MoviesComponent } from "./movies.component"
import { MoviesService } from "./movies.service"
import { FormBuilder, ReactiveFormsModule } from "@angular/forms"
import { of, throwError } from "rxjs"
import { HttpClientTestingModule } from "@angular/common/http/testing"

describe("MoviesComponent (Unit Tests)", () => {
  let component: MoviesComponent
  let fixture: ComponentFixture<MoviesComponent>
  let moviesService: jest.Mocked<MoviesService>

  const mockMovie = {
    Title: "Test Movie",
    Year: "2024",
    imdbID: "tt1234567",
    Plot: "Test plot",
    Poster: "test.jpg",
    Director: "Test Director",
    Actors: "Test Actor",
    Runtime: "120 min",
    Rated: "PG-13",
    Genre: "Action",
    Released: "01 Jan 2024",
    Writer: "Test Writer",
    Language: "English",
    imdbRating: "8.0",
    BoxOffice: "$100M",
    Ratings: [{ Source: "IMDB", Value: "8.0/10" }],
  }

  const mockReviews = [
    {
      id: "1",
      movieId: "tt1234567",
      reviewText: "Great movie!",
      username: "testuser",
      createdAt: {
        _seconds: 1234567890,
        _nanoseconds: 0,
      },
    },
  ]

  const mockSuccessResponse = {
    message: "success",
    data: { movie: mockMovie, reviews: mockReviews },
  }

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  beforeEach(async () => {
    const mockMoviesService = {
      searchMovies: jest.fn(),
      submitReview: jest.fn(),
    }

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, MoviesComponent],
      providers: [
        FormBuilder,
        { provide: MoviesService, useValue: mockMoviesService },
      ],
    }).compileComponents()

    moviesService = TestBed.inject(MoviesService) as jest.Mocked<MoviesService>
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviesComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it("should create", () => {
    expect(component).toBeTruthy()
  })

  it("should search for movies and update state", () => {
    moviesService.searchMovies.mockReturnValue(of(mockSuccessResponse))

    component.searchQuery = "Test Movie"
    component.search()

    expect(moviesService.searchMovies).toHaveBeenCalledWith("Test Movie")
    expect(component.movie).toEqual(mockMovie)
    expect(component.reviews).toEqual(mockReviews)
    expect(component.isLoading).toBeFalsy()
  })

  it("should handle search error", () => {
    moviesService.searchMovies.mockReturnValue(
      throwError(() => new Error("Test error"))
    )

    component.searchQuery = "Test Movie"
    component.search()

    expect(component.error).toBe("Failed to fetch movie")
    expect(component.isLoading).toBeFalsy()
  })

  it("should submit review and clear form", () => {
    component.movie = mockMovie
    component.reviewForm.setValue({ reviewText: "Great movie!" })
    moviesService.submitReview.mockReturnValue(of({}))
    moviesService.searchMovies.mockReturnValue(of(mockSuccessResponse))

    component.onSubmitReview()

    expect(moviesService.submitReview).toHaveBeenCalledWith(
      "tt1234567",
      "Great movie!"
    )
    expect(component.reviewForm.get("reviewText")?.value).toBeNull()
  })

  it("should not submit if review form is invalid", () => {
    component.movie = mockMovie
    component.reviewForm.setValue({ reviewText: "" })

    component.onSubmitReview()

    expect(moviesService.submitReview).not.toHaveBeenCalled()
  })
})
